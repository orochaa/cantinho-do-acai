import { useCart } from '@/context/cart-provider';
import { useToast } from '@/context/toast-provider';
import type { CartItem } from '@/domain/cart';
import { formatCurrency, singularOrPlural } from '@/domain/format';
import { createOrderItem } from '@/domain/order';
import { useEffect, useState } from 'react';
import { Button } from './button';
import { DialogHeader } from './dialog-header';
import { QuantityStepper } from './quantity-stepper';
import { ResponsiveDialog } from './responsive-dialog';
import { Textarea } from './textarea';

export interface QuickAddOption {
  name: string;
  price: number;
}

export interface QuickAddOptionStep {
  defaultOptionIndex: number;
  description: string;
  id: string;
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

type OptionIndexes = Readonly<Record<string, number>>;
const noOptionSteps: ReadonlyArray<QuickAddOptionStep> = [];

const createOptionIndexes = (
  steps: ReadonlyArray<QuickAddOptionStep>,
): OptionIndexes =>
  Object.fromEntries(steps.map(step => [step.id, step.defaultOptionIndex]));

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
          <img
            src={props.product.img}
            alt={`Imagem de ${props.product.name}`}
            className="aspect-video w-full rounded-lg object-cover"
          />
          <p className="mt-2 whitespace-pre-line text-zinc-700">
            {props.product.description}
          </p>
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

export function QuickAddDialog(props: QuickAddDialogProps): React.JSX.Element {
  const { addCartEvent } = useCart();
  const toast = useToast();
  const optionSteps = props.steps ?? noOptionSteps;
  const workflowSteps = [...optionSteps, { title: 'Revisar' }];
  const reviewStep = workflowSteps.length - 1;
  const [count, setCount] = useState(1);
  const [observation, setObservation] = useState('');
  const [optionIndexes, setOptionIndexes] = useState<OptionIndexes>(() =>
    createOptionIndexes(optionSteps),
  );
  const [step, setStep] = useState(0);
  const [isDiscardDialogOpen, setIsDiscardDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const product = props.product;
  const editItem = props.editItem;
  const currentOptionStep = optionSteps[step];
  const selectedOptions = optionSteps.flatMap(optionStep => {
    const option = optionStep.options[optionIndexes[optionStep.id]];
    return option ? [option] : [];
  });
  const unitPrice = product
    ? product.price +
      selectedOptions.reduce((sum, option) => sum + option.price, 0)
    : 0;
  const total = unitPrice * count;
  const dirty =
    count !== (editItem?.count ?? 1) ||
    observation !== (editItem?.observation ?? '') ||
    optionSteps.some(
      optionStep =>
        optionIndexes[optionStep.id] !==
        (editItem?.options.find(option =>
          optionStep.options.some(candidate => candidate.name === option.name),
        )
          ? optionStep.options.findIndex(
              candidate =>
                candidate.name ===
                editItem?.options.find(option =>
                  optionStep.options.some(
                    candidate => candidate.name === option.name,
                  ),
                )?.name,
            )
          : optionStep.defaultOptionIndex),
    );

  const resetDraft = (): void => {
    setCount(editItem?.count ?? 1);
    setObservation(editItem?.observation ?? '');
    setOptionIndexes(
      Object.fromEntries(
        optionSteps.map(step => {
          const saved = editItem?.options.find(option =>
            step.options.some(candidate => candidate.name === option.name),
          );
          return [
            step.id,
            saved
              ? step.options.findIndex(option => option.name === saved.name)
              : step.defaultOptionIndex,
          ];
        }),
      ),
    );
    setStep(0);
    setIsDiscardDialogOpen(false);
    setIsDetailsDialogOpen(false);
  };

  useEffect(() => {
    if (!props.open) {
      return;
    }
    setCount(editItem?.count ?? 1);
    setObservation(editItem?.observation ?? '');
    setOptionIndexes(
      Object.fromEntries(
        optionSteps.map(step => {
          const saved = editItem?.options.find(option =>
            step.options.some(candidate => candidate.name === option.name),
          );
          return [
            step.id,
            saved
              ? step.options.findIndex(option => option.name === saved.name)
              : step.defaultOptionIndex,
          ];
        }),
      ),
    );
    setStep(0);
    setIsDiscardDialogOpen(false);
    setIsDetailsDialogOpen(false);
  }, [editItem, optionSteps, props.open]);

  const close = (): void => {
    if (dirty) {
      setIsDiscardDialogOpen(true);
      return;
    }
    resetDraft();
    props.onClose();
  };

  const discard = (): void => {
    resetDraft();
    props.onClose();
  };

  const add = (): void => {
    if (!product) {
      return;
    }
    const item = createOrderItem({
      product,
      options: selectedOptions.map(option => ({ ...option, count: 1 })),
      count,
      observation: observation || undefined,
    });
    addCartEvent(
      editItem
        ? { type: 'replace', id: editItem.id, item }
        : { type: 'add', item },
    );
    if (editItem) {
      toast.success({
        description: `${product.name} atualizado no pedido.`,
      });
    }
    props.onClose();
    resetDraft();
    if (editItem) {
      props.onEditSave?.();
    }
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
            <fieldset className="mt-4">
              <legend className="text-lg font-semibold text-purple-950">
                {currentOptionStep.title}
              </legend>
              <p className="mt-1 text-sm text-zinc-700">
                {currentOptionStep.description}
              </p>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                {currentOptionStep.options.map((item, index) => (
                  <button
                    key={item.name}
                    type="button"
                    aria-pressed={optionIndexes[currentOptionStep.id] === index}
                    className={`min-h-16 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-700 rounded-lg border px-3 text-left ${optionIndexes[currentOptionStep.id] === index ? 'border-purple-700 bg-purple-100' : 'border-zinc-300'}`}
                    onClick={() =>
                      setOptionIndexes(current => ({
                        ...current,
                        [currentOptionStep.id]: index,
                      }))
                    }>
                    {item.name}
                    <span className="block text-sm">
                      {formatCurrency(product.price + item.price)}
                    </span>
                  </button>
                ))}
              </div>
            </fieldset>
          )}
          {step === reviewStep && (
            <div className="mt-4 rounded-xl bg-purple-50 p-4">
              <h3 className="text-lg font-semibold text-purple-950">
                Revise seu pedido
              </h3>
              <div className="mt-3 flex gap-3">
                <img
                  src={product.img}
                  alt={`Imagem de ${product.name}`}
                  className="size-16 rounded-lg object-cover"
                />
                <div className="min-w-0">
                  <p className="font-semibold text-purple-950">
                    {product.name}
                  </p>
                  {selectedOptions.map(option => (
                    <p
                      className="text-sm"
                      key={option.name}>
                      {option.name}
                    </p>
                  ))}
                </div>
              </div>
              <label
                className="mt-4 block text-sm font-medium text-purple-950"
                htmlFor="quick-add-observation">
                Observação (opcional)
                <Textarea
                  id="quick-add-observation"
                  className="mt-1 text-base font-normal"
                  placeholder={props.observationPlaceholder}
                  value={observation}
                  onChange={event => setObservation(event.target.value)}
                />
              </label>
              <div className="mt-4 flex items-center justify-between gap-3 border-t border-purple-200 pt-4">
                <QuantityStepper
                  count={count}
                  decreaseDisabled={count === 1}
                  decreaseLabel="Diminuir quantidade"
                  decreaseTitle="Diminuir quantidade"
                  increaseLabel="Aumentar quantidade"
                  increaseTitle="Aumentar quantidade"
                  onDecrease={() => setCount(current => current - 1)}
                  onIncrease={() => setCount(current => current + 1)}
                />
                <span className="font-poppins text-xl font-semibold">
                  {formatCurrency(total)}
                </span>
              </div>
            </div>
          )}
          <div className="mt-4 flex gap-3">
            {step > 0 && (
              <Button
                variant="cancel"
                className="grow"
                onClick={() => setStep(current => current - 1)}>
                Voltar
              </Button>
            )}
            {step < reviewStep ? (
              <Button
                variant="confirm"
                className="grow-2"
                onClick={() => setStep(current => current + 1)}>
                Continuar
              </Button>
            ) : (
              <Button
                variant="confirm"
                className="grow-2"
                onClick={add}>
                Adicionar ao pedido · {formatCurrency(total)}
              </Button>
            )}
          </div>
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
