import { Check, CircleX, X } from 'lucide-react'
import { motion } from 'motion/react'
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import type { ReactNode } from 'react'

interface ToastAction {
  label: string
  onClick: () => void
}

type ToastType = 'success' | 'error'

interface ToastOptions {
  type: ToastType
  title?: string
  description: string
  action?: ToastAction
}

interface IToastContext {
  success: (options: Omit<ToastOptions, 'type'>) => void
  error: (options: Omit<ToastOptions, 'type'>) => void
}

const ToastContext = createContext<IToastContext | undefined>(undefined)

export function useToast(): IToastContext {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }

  return context
}

interface ToastProviderProps {
  children: ReactNode
}

export function ToastProvider(props: ToastProviderProps): React.JSX.Element {
  const [toast, setToast] = useState<ToastOptions | null>(null)

  const showToast = useCallback((options: ToastOptions) => {
    setToast(options)
    setTimeout(() => setToast(null), 5000)
  }, [])

  const handleClose = (): void => {
    setToast(null)
  }

  const handleActionClick = (): void => {
    toast?.action?.onClick()
    handleClose()
  }

  const context = useMemo(
    () => ({
      success: (options: Omit<ToastOptions, 'type'>): void =>
        showToast({ ...options, type: 'success' }),
      error: (options: Omit<ToastOptions, 'type'>): void =>
        showToast({ ...options, type: 'error' }),
    }),
    [showToast]
  )

  return (
    <ToastContext.Provider value={context}>
      {props.children}
      {!!toast && (
        <motion.div
          initial={{
            x: 50,
            opacity: 0,
          }}
          animate={{
            x: 0,
            opacity: 1,
          }}
          className="fixed right-5 bottom-5 z-50 w-11/12 max-w-sm rounded-md bg-slate-800 p-4 text-white shadow-lg"
        >
          <div className="flex items-center gap-4">
            {toast.type === 'success' ? (
              <Check className="size-8 text-green-500" />
            ) : (
              <CircleX className="size-8 text-red-500" />
            )}
            <div className="flex w-full items-start justify-between">
              <div className="flex-1">
                <h4
                  data-type={toast.type}
                  className="font-bold data-[type=error]:text-red-500 data-[type=success]:text-green-500"
                >
                  {toast.title ??
                    (toast.type === 'success' ? 'Sucesso' : 'Erro')}
                </h4>
                {!!toast.description && (
                  <p className="text-sm">{toast.description}</p>
                )}
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="ml-4 flex h-8 w-8 items-center justify-center rounded-full text-xl transition hover:bg-gray-700"
                aria-label="Fechar notificação"
              >
                <X className="size-5" />
              </button>
            </div>
          </div>
          {!!toast.action && (
            <button
              type="button"
              onClick={handleActionClick}
              className="mt-2 w-full rounded bg-indigo-500 px-4 py-2 text-white transition hover:bg-indigo-500/80"
            >
              {toast.action.label}
            </button>
          )}
        </motion.div>
      )}
    </ToastContext.Provider>
  )
}
