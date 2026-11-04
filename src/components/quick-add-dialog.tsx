import { ProductImage } from '@/components/product-image';
import { type ICartContext, useCart } from '@/context/cart-provider';
import { useToast } from '@/context/toast-provider';
import type { CartItem } from '@/domain/cart';
import { formatCurrency, singularOrPlural } from '@/domain/format';
import { createOrderItem, createProductPriceDiscount } from '@/domain/order';
import type {
  MultipleOptionsState,
  SingleOptionState,
} from '@/domain/product-personalization';
import { useEffect, useState } from 'react';
import { Button } from './button';
import { Description } from './description';
import { DialogHeader } from './dialog-header';
import { MultipleOptionRow } from './multiple-options-selector';
import { QuantityStepper } from './quantity-stepper';
import { ResponsiveDialog } from './responsive-dialog';
import { SingleOptionSelector } from './single-option-selector';
import { Textarea } from './textarea';

export interface QuickAddOption {
  name: string;
  price: number;
  priceMode?: Option['priceMode'];
  img?: string;
}

export interface QuickAddOptionStep {
  defaultOptionIndex?: number;
  description: string;
  id: string;
  countLimit?: number;
  discountProductPrice?: boolean;
  required?: string;
  selection?: 'single' | 'multiple';
  options: ReadonlyArray<QuickAddOption>;
  title: string;
}

export interface QuickAddDialogProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
  observationPlaceholder: string;
  steps?: ReadonlyArray<QuickAddOptionStep>;
  editItem?: CartItem;
  onEditSave?: () => void;
}

type OptionCounts = Readonly<Record<string, ReadonlyArray<number>>>;
const noOptionSteps: ReadonlyArray<QuickAddOptionStep> = [];

const createOptionCounts = (
  steps: ReadonlyArray<QuickAddOptionStep>,
  item?: CartItem,
): OptionCounts =>
  Object.fromEntries(
    steps.map(step => {
      const counts = Array.from({ length: step.options.length }, () => 0);
      for (const option of item?.options ?? []) {
        const index = step.options.findIndex(
          candidate => candidate.name === option.name,
        );
        if (index >= 0) {
          counts[index] =
            step.selection === 'multiple' ? counts[index] + option.count : 1;
        }
      }
      if (
        !item &&
        step.selection !== 'multiple' &&
        step.defaultOptionIndex !== undefined &&
        counts[step.defaultOptionIndex] !== undefined
      ) {
        counts[step.defaultOptionIndex] = 1;
      }
      return [step.id, counts];
    }),
  );

const adjustOptionCount = (
  current: OptionCounts,
  step: QuickAddOptionStep,
  index: number,
  adjustment: 1 | -1,
): OptionCounts => {
  const counts = [...(current[step.id] ?? [])];
  if (step.selection !== 'multiple') {
    return {
      ...current,
      [step.id]: counts.map((_count, optionIndex) =>
        optionIndex === index ? (adjustment > 0 ? 1 : 0) : 0,
      ),
    };
  }
  const nextCount = Math.max(0, (counts[index] ?? 0) + adjustment);
  const total = counts.reduce((sum, count) => sum + count, 0);
  const countLimit = step.selection === 'multiple' ? step.countLimit : 1;
  if (adjustment > 0 && countLimit !== undefined && total >= countLimit) {
    return current;
  }
  counts[index] = nextCount;
  return { ...current, [step.id]: counts };
};

const hasOptionSelectionChanged = (
  steps: ReadonlyArray<QuickAddOptionStep>,
  current: OptionCounts,
  initial: OptionCounts,
): boolean =>
  steps.some(step => {
    const getCounts = (counts: ReadonlyArray<number> | undefined): string =>
      (counts ?? []).join('|');
    return getCounts(current[step.id]) !== getCounts(initial[step.id]);
  });

const getSelectedOptions = (
  steps: ReadonlyArray<QuickAddOptionStep>,
  countsByStep: OptionCounts,
): Array<Option> =>
  steps.flatMap(step =>
    step.options.flatMap((option, index) => {
      const count = countsByStep[step.id]?.[index] ?? 0;
      return count > 0 ? [{ ...option, count }] : [];
    }),
  );

const hasSelectedPriceDiscount = (
  steps: ReadonlyArray<QuickAddOptionStep>,
  countsByStep: OptionCounts,
): boolean =>
  steps.some(
    step =>
      step.discountProductPrice &&
      (countsByStep[step.id] ?? []).some(count => count > 0),
  );

const getMissingRequiredStep = (
  steps: ReadonlyArray<QuickAddOptionStep>,
  countsByStep: OptionCounts,
): number =>
  steps.findIndex(
    step =>
      !!step.required &&
      !(countsByStep[step.id] ?? []).some(count => count > 0),
  );

const getOrderOptions = (
  product: Product | null,
  options: Array<Option>,
  discountProductPrice: boolean,
): Array<Option> =>
  product && discountProductPrice
    ? [...options, createProductPriceDiscount(product)]
    : options;

interface SaveQuickOrderInput {
  product: Product | null;
  options: Array<Option>;
  count: number;
  observation?: string;
  editItem?: CartItem;
  addCartEvent: ICartContext['addCartEvent'];
  onEdit?: () => void;
}

const saveQuickOrder = (input: SaveQuickOrderInput): void => {
  const product = input.product;
  if (!product) {
    return;
  }
  const item = createOrderItem({
    product,
    options: input.options,
    count: input.count,
    observation: input.observation,
  });
  input.addCartEvent(
    input.editItem
      ? { type: 'replace', id: input.editItem.id, item }
      : { type: 'add', item },
  );
  if (input.editItem) {
    input.onEdit?.();
  }
};

interface CloseQuickAddInput {
  dirty: boolean;
  resetDraft: () => void;
  onOpenDiscard: () => void;
  onClose: () => void;
}

const closeQuickAdd = (input: CloseQuickAddInput): void => {
  if (input.dirty) {
    input.onOpenDiscard();
    return;
  }
  input.resetDraft();
  input.onClose();
};

interface ProductDetailsDialogProps {
  product: Product;
  open: boolean;
  onClose: () => void;
}

function ProductDetailsDialog(
  props: ProductDetailsDialogProps,
): React.JSX.Element | null {
  return (
    <ResponsiveDialog
      labelledBy="product-details-title"
      open={props.open}
      onClose={props.onClose}>
      <div className="flex min-h-0 flex-1 flex-col">
        <DialogHeader
          title={props.product.name}
          titleId="product-details-title"
        />
        <div className="mt-1 rounded-xl bg-purple-50 p-4">
          <ProductImage
            product={props.product}
            className="aspect-video w-full rounded-lg"
          />
          <div className="mt-2 text-zinc-700">
            <Description>{props.product.description}</Description>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-purple-200 pt-4">
            <p className="text-sm font-medium text-purple-950">
              Serve até{' '}
              {singularOrPlural(props.product.people, 'pessoa', 'pessoas')}
              {props.product.quantity ? ` · ${props.product.quantity}g` : ''}
            </p>
            <p className="font-poppins text-xl font-semibold tracking-tighter text-purple-950">
              {formatCurrency(props.product.price)}
            </p>
          </div>
          <Button
            variant="cancel"
            className="mt-4 w-full"
            onClick={props.onClose}>
            Voltar
          </Button>
        </div>
      </div>
    </ResponsiveDialog>
  );
}

interface QuickAddReviewProps {
  open: boolean;
  product: Product;
  options: ReadonlyArray<Option>;
  acceptsObservation: boolean;
  observationPlaceholder: string;
  observation: string;
  count: number;
  total: number;
  hasProductPriceDiscountOptionGroup: boolean;
  onObservationChange: (value: string) => void;
  onDecrease: () => void;
  onIncrease: () => void;
}

function QuickAddReview(props: QuickAddReviewProps): React.JSX.Element | null {
  if (!props.open) {
    return null;
  }

  return (
    <div className="mt-4 rounded-xl bg-purple-50 p-4">
      <h3 className="text-lg font-semibold text-purple-950">
        Revise seu pedido
      </h3>
      <div className="mt-3 flex gap-3">
        <ProductImage
          product={props.product}
          className="size-16 rounded-lg"
        />
        <div className="min-w-0">
          <p className="font-semibold text-purple-950">{props.product.name}</p>
          {props.options.map(option => (
            <p
              className="text-sm"
              key={option.name}>
              {option.count} × {option.name}
            </p>
          ))}
        </div>
      </div>
      {props.acceptsObservation ? (
        <label
          className="mt-4 block text-sm font-medium text-purple-950"
          htmlFor="quick-add-observation">
          Observação (opcional)
          <Textarea
            id="quick-add-observation"
            className="mt-1 text-base font-normal"
            placeholder={props.observationPlaceholder}
            value={props.observation}
            onChange={event => props.onObservationChange(event.target.value)}
          />
        </label>
      ) : null}
      <div className="mt-4 flex items-center justify-between gap-3 border-t border-purple-200 pt-4">
        {!props.hasProductPriceDiscountOptionGroup && (
          <QuantityStepper
            count={props.count}
            decreaseDisabled={props.count === 1}
            decreaseLabel="Diminuir quantidade"
            decreaseTitle="Diminuir quantidade"
            increaseLabel="Aumentar quantidade"
            increaseTitle="Aumentar quantidade"
            onDecrease={props.onDecrease}
            onIncrease={props.onIncrease}
          />
        )}
        <span className="ml-auto font-poppins text-xl font-semibold">
          {formatCurrency(props.total)}
        </span>
      </div>
    </div>
  );
}

interface OptionStepPickerProps {
  product: Product;
  step: QuickAddOptionStep;
  selectedCounts: ReadonlyArray<number>;
  showRequiredError: boolean;
  onAdd: (index: number) => void;
  onRemove: (index: number) => void;
}

function OptionStepPicker(props: OptionStepPickerProps): React.JSX.Element {
  const { product, step, selectedCounts, showRequiredError, onAdd, onRemove } =
    props;
  const countTotal = selectedCounts.reduce((sum, count) => sum + count, 0);
  const requiredError =
    showRequiredError && step.required && countTotal === 0 ? (
      <p
        className="mt-2 text-sm text-red-700"
        role="alert">
        {step.required}
      </p>
    ) : null;
  const singleState: SingleOptionState = {
    isSelected: countTotal > 0,
    options: step.options.map((option, index) => ({
      ...option,
      price:
        option.priceMode === 'adjustment'
          ? product.price + option.price
          : option.price,
      count: selectedCounts[index] ?? 0,
      isSelected: (selectedCounts[index] ?? 0) > 0,
    })),
  };
  const multipleState: MultipleOptionsState = {
    type: 'multiple',
    options: step.options.map((option, index) => ({
      ...option,
      count: selectedCounts[index] ?? 0,
    })),
    countLimit: step.selection === 'multiple' ? step.countLimit : 1,
    countTotal,
  };

  if (step.selection !== 'multiple') {
    return (
      <div className="mt-4">
        <SingleOptionSelector
          title={step.title}
          description={step.description}
          ctx={singleState}
          bare
          required={!!step.required}
          onSelectionChange={option => {
            const index = step.options.findIndex(
              candidate => candidate.name === option.name,
            );
            if (index < 0 || (option.isSelected && step.required)) {
              return;
            }
            if (option.isSelected) {
              onRemove(index);
            } else {
              onAdd(index);
            }
          }}
        />
        {requiredError}
      </div>
    );
  }

  return (
    <fieldset className="mt-4">
      <legend className="text-lg font-semibold text-purple-950">
        {step.title}
      </legend>
      <p className="mt-1 text-sm text-zinc-700">{step.description}</p>
      <div className="mt-3 flex flex-col gap-2">
        {multipleState.options.map((option, index) => {
          const ctx =
            step.selection === 'multiple'
              ? multipleState
              : { ...multipleState, countTotal: option.count };
          return (
            <MultipleOptionRow
              key={option.name}
              option={option}
              ctx={ctx}
              dispatchEvent={event =>
                event.type === 'add' ? onAdd(index) : onRemove(index)
              }
            />
          );
        })}
      </div>
      {requiredError}
    </fieldset>
  );
}

interface QuickAddFooterProps {
  step: number;
  reviewStep: number;
  total: number;
  onBack: () => void;
  onContinue: () => void;
  onAdd: () => void;
}

function QuickAddFooter(props: QuickAddFooterProps): React.JSX.Element {
  return (
    <div className="mt-4 flex gap-3">
      {props.step > 0 && (
        <Button
          variant="cancel"
          className="grow"
          onClick={props.onBack}>
          Voltar
        </Button>
      )}
      {props.step < props.reviewStep ? (
        <Button
          variant="confirm"
          className="grow-2"
          onClick={props.onContinue}>
          Continuar
        </Button>
      ) : (
        <Button
          variant="confirm"
          className="grow-2"
          onClick={props.onAdd}>
          Adicionar ao pedido · {formatCurrency(props.total)}
        </Button>
      )}
    </div>
  );
}

export function QuickAddDialog(props: QuickAddDialogProps): React.JSX.Element {
  const { addCartEvent } = useCart();
  const toast = useToast();
  const optionSteps = props.steps ?? noOptionSteps;
  const workflowSteps = [...optionSteps, { title: 'Revisar' }];
  const reviewStep = workflowSteps.length - 1;
  const product = props.product;
  const editItem = props.editItem;
  const initialOptionCounts = createOptionCounts(optionSteps, editItem);
  const [count, setCount] = useState(1);
  const [observation, setObservation] = useState('');
  const [optionCounts, setOptionCounts] = useState<OptionCounts>(
    () => initialOptionCounts,
  );
  const [step, setStep] = useState(0);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [isDiscardDialogOpen, setIsDiscardDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const acceptsObservation = product?.acceptsObservation !== false;
  const currentOptionStep = optionSteps[step];
  const selectedOptions = getSelectedOptions(optionSteps, optionCounts);
  const hasProductPriceDiscountOptionGroup = optionSteps.some(
    optionStep => optionStep.discountProductPrice,
  );
  const shouldDiscountProductPrice = hasSelectedPriceDiscount(
    optionSteps,
    optionCounts,
  );
  const unitPrice = product
    ? product.price +
      selectedOptions.reduce(
        (sum, option) => sum + (option.price ?? 0) * option.count,
        0,
      ) -
      (shouldDiscountProductPrice ? product.price : 0)
    : 0;
  const orderCount = shouldDiscountProductPrice ? 1 : count;
  const total = unitPrice * orderCount;
  const dirty =
    count !== (editItem?.count ?? 1) ||
    (acceptsObservation && observation !== (editItem?.observation ?? '')) ||
    hasOptionSelectionChanged(optionSteps, optionCounts, initialOptionCounts);

  const resetDraft = (): void => {
    setCount(editItem?.count ?? 1);
    setObservation(editItem?.observation ?? '');
    setOptionCounts(createOptionCounts(optionSteps, editItem));
    setStep(0);
    setHasAttemptedSubmit(false);
    setIsDiscardDialogOpen(false);
    setIsDetailsDialogOpen(false);
  };

  useEffect(() => {
    if (!props.open) {
      return;
    }
    setCount(editItem?.count ?? 1);
    setObservation(editItem?.observation ?? '');
    setOptionCounts(createOptionCounts(optionSteps, editItem));
    setStep(0);
    setHasAttemptedSubmit(false);
    setIsDiscardDialogOpen(false);
    setIsDetailsDialogOpen(false);
  }, [editItem, optionSteps, props.open]);

  const close = (): void => {
    closeQuickAdd({
      dirty,
      resetDraft,
      onOpenDiscard: () => setIsDiscardDialogOpen(true),
      onClose: props.onClose,
    });
  };

  const discard = (): void => {
    resetDraft();
    props.onClose();
  };

  const add = (): void => {
    const missingStepIndex = getMissingRequiredStep(optionSteps, optionCounts);
    if (missingStepIndex >= 0) {
      setHasAttemptedSubmit(true);
      setStep(missingStepIndex);
      return;
    }
    saveQuickOrder({
      product,
      options: getOrderOptions(
        product,
        selectedOptions,
        shouldDiscountProductPrice,
      ),
      count: orderCount,
      observation: acceptsObservation ? observation || undefined : undefined,
      editItem,
      addCartEvent,
      onEdit: () => {
        toast.success({
          description: `${product?.name} atualizado no pedido.`,
        });
        props.onEditSave?.();
      },
    });
    props.onClose();
    resetDraft();
  };

  const adjustOption = (index: number, direction: 'add' | 'remove'): void => {
    if (!currentOptionStep) {
      return;
    }
    setOptionCounts(current =>
      adjustOptionCount(
        current,
        currentOptionStep,
        index,
        direction === 'add' ? 1 : -1,
      ),
    );
  };

  return (
    <ResponsiveDialog
      labelledBy="quick-add-title"
      open={props.open}
      onClose={close}>
      {!!product && (
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          <DialogHeader
            title={
              <div className="flex flex-col gap-1">
                <span>{product.name}</span>
                <button
                  type="button"
                  className="self-start text-sm text-purple-600 underline decoration-purple-300 underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-700"
                  onClick={() => setIsDetailsDialogOpen(true)}>
                  Ver detalhes
                </button>
              </div>
            }
            titleId="quick-add-title"
            onClose={close}
          />
          <p
            aria-live="polite"
            className="text-sm font-medium text-purple-800">
            Etapa {step + 1} de {workflowSteps.length}:{' '}
            {workflowSteps[step]?.title}
          </p>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-purple-100">
            <div
              className="h-full rounded-full bg-purple-700 transition-[width]"
              style={{
                width: `${((step + 1) / workflowSteps.length) * 100}%`,
              }}
            />
          </div>
          {!!currentOptionStep && (
            <OptionStepPicker
              product={product}
              step={currentOptionStep}
              selectedCounts={optionCounts[currentOptionStep.id] ?? []}
              showRequiredError={hasAttemptedSubmit}
              onAdd={index => adjustOption(index, 'add')}
              onRemove={index => adjustOption(index, 'remove')}
            />
          )}
          <QuickAddReview
            open={step === reviewStep}
            product={product}
            options={selectedOptions}
            acceptsObservation={acceptsObservation}
            observationPlaceholder={props.observationPlaceholder}
            observation={observation}
            count={count}
            total={total}
            hasProductPriceDiscountOptionGroup={
              hasProductPriceDiscountOptionGroup
            }
            onObservationChange={setObservation}
            onDecrease={() => setCount(current => current - 1)}
            onIncrease={() => setCount(current => current + 1)}
          />
          <QuickAddFooter
            step={step}
            reviewStep={reviewStep}
            total={total}
            onBack={() => setStep(current => current - 1)}
            onContinue={() => setStep(current => current + 1)}
            onAdd={add}
          />
        </div>
      )}
      {!!product && (
        <ProductDetailsDialog
          product={product}
          open={props.open && isDetailsDialogOpen}
          onClose={() => setIsDetailsDialogOpen(false)}
        />
      )}
      <ResponsiveDialog
        labelledBy="discard-changes-title"
        open={props.open && isDiscardDialogOpen}
        onClose={discard}>
        <div className="flex min-h-0 flex-1 flex-col">
          <DialogHeader
            closeLabel="Continuar editando"
            title="Descartar alterações?"
            titleId="discard-changes-title"
            onClose={() => setIsDiscardDialogOpen(false)}
          />
          <p className="text-zinc-700">
            Suas escolhas para este item serão removidas.
          </p>
          <div className="mt-6 flex gap-3">
            <Button
              variant="cancel"
              className="min-h-11 flex-1"
              onClick={() => setIsDiscardDialogOpen(false)}>
              Continuar editando
            </Button>
            <Button
              variant="confirm"
              className="min-h-11 flex-1"
              onClick={discard}>
              Descartar
            </Button>
          </div>
        </div>
      </ResponsiveDialog>
    </ResponsiveDialog>
  );
}
