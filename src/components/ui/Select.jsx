import { ArrowDownIcon, ArrowUpIcon, CheckIcon } from '@/components/Icons.jsx'
import '@/styles/ui/Select.css'
import * as SelectPrimitive from '@radix-ui/react-select'
import classnames from 'classnames'
import * as React from 'react'

const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger ref={ref} className={classnames('form-select-trigger', className)} {...props}>
    {children}
    <SelectPrimitive.Icon asChild className='form-select-icon'>
      <ArrowDownIcon width={20} height={20} color='#6b7280' />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))

const SelectContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content ref={ref} className={classnames('form-select-content', className)} {...props}>
      <SelectPrimitive.ScrollUpButton className='form-select-scroll-button'>
        <ArrowUpIcon width={18} height={18} />
      </SelectPrimitive.ScrollUpButton>

      <SelectPrimitive.Viewport className='form-select-viewport'>
        {children}
      </SelectPrimitive.Viewport>

      <SelectPrimitive.ScrollDownButton className='form-select-scroll-button'>
        <ArrowDownIcon width={18} height={18} />
      </SelectPrimitive.ScrollDownButton>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))

const SelectItem = React.forwardRef(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item ref={ref} className={classnames('form-select-item', className)} {...props}>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    <SelectPrimitive.ItemIndicator className='form-select-item-indicator'>
      <CheckIcon />
    </SelectPrimitive.ItemIndicator>
  </SelectPrimitive.Item>
))

const SelectLabel = React.forwardRef(({ className, ...props }, ref) => (
  <SelectPrimitive.Label ref={ref} className={classnames('form-select-label', className)} {...props} />
))

const SelectSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator ref={ref} className={classnames('form-select-separator', className)} {...props} />
))

/**
 * Un componente Select reutilizable y accesible basado en Radix UI.
 * Maneja la lógica de renderizado para listas simples y agrupadas.
 *
 * @param {Object} props - Propiedades del componente.
 * @param {Array<Object>} props.options - Array de opciones a mostrar.
 * - Para Formato Simple: `[{ label: 'Manzana', value: 'apple', disabled: false }]`
 * - Para Formato Agrupado: `[{ label: 'Frutas', items: [{ label: 'Manzana', value: 'apple' }] }]`
 * (Si `label` es null o undefined, el encabezado del grupo no se renderizará).
 * @param {function} props.onChange - Callback que se ejecuta cuando se selecciona un valor.
 * Recibe el valor original (ej: 'apple' o null), no el valor interno.
 * @param {string|number|null} props.value - El valor actualmente seleccionado (controlado).
 * @param {string} [props.placeholder] - Texto a mostrar cuando no hay ningún valor seleccionado.
 * @param {string} [props.className] - Clases CSS adicionales para aplicar al `SelectTrigger` (para variantes).
 * @param {React.Ref} ref - La ref que se reenvía al elemento `SelectTrigger`.
 * @returns {React.ReactElement} El elemento JSX del componente Select.
 */
const Select = React.forwardRef(({ options = [], onChange, value, placeholder, className, ...props }, ref) => {
  const isGrouped = Array.isArray(options) && options.length > 0 && options[0]?.items

  const internalToOriginal = {}
  const internals = []
  let emptyCounter = 0

  const processItem = (item) => {
    const original = item.value
    let internal
    if (original === '' || original == null) {
      internal = `__empty__${emptyCounter++}`
    } else {
      internal = String(original)
    }

    internalToOriginal[internal] = original
    internals.push(internal)

    return {
      ...item,
      __internalValue: internal
    }
  }

  let processed = null
  if (isGrouped) {
    processed = options.map((group) => ({
      label: group.label,
      items: (group.items || []).map(processItem)
    }))
  } else {
    processed = (options || []).map(processItem)
  }

  const findInternalForOriginal = (orig) => {
    if (orig != null && orig !== '') {
      const s = String(orig)
      if (internals.includes(s)) return s
    }
    for (const k of Object.keys(internalToOriginal)) {
      if (internalToOriginal[k] === orig) return k
    }
    return undefined
  }

  const radixValue = value == null ? undefined : findInternalForOriginal(value) ?? String(value)

  const handleInternalChange = (internalVal) => {
    const original = Object.prototype.hasOwnProperty.call(internalToOriginal, internalVal)
      ? internalToOriginal[internalVal]
      : internalVal
    onChange && onChange(original)
  }

  let renderedItems = null
  if (isGrouped) {
    renderedItems = processed.map((group, index) => (
      <SelectPrimitive.Group key={group.label || index}>
        {group.label && <SelectLabel>{group.label}</SelectLabel>}
        {group.items.map((item) => (
          <SelectItem key={item.__internalValue} value={item.__internalValue} disabled={item.disabled}>
            {item.label}
          </SelectItem>
        ))}
        {index < processed.length - 1 && <SelectSeparator />}
      </SelectPrimitive.Group>
    ))
  } else {
    renderedItems = processed.map((item) => (
      <SelectItem key={item.__internalValue} value={item.__internalValue} disabled={item.disabled}>
        {item.label}
      </SelectItem>
    ))
  }

  return (
    <SelectPrimitive.Root value={radixValue} onValueChange={handleInternalChange} {...props}>
      <SelectTrigger ref={ref} className={className}>
        <SelectPrimitive.Value placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {renderedItems}
      </SelectContent>
    </SelectPrimitive.Root>
  )
})

export { Select }
