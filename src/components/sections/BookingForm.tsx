import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion } from 'motion/react'
import { CalendarDays, Check, Copy, Info, Minus, Phone, Plus, Send } from 'lucide-react'
import { useEffect, useId, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { BOOKING_NOTICE } from '../../config/hotel'
import { roomTitle, rooms } from '../../data/rooms'
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery'
import { createBookingSchema, MAX_GUESTS, type BookingFormValues } from '../../lib/booking'
import { phoneHref, whatsappNumber, whatsappUrl } from '../../lib/contact'
import { cn } from '../../lib/cn'
import { addDaysISO, todayISO } from '../../lib/dates'
import { buildBookingMessage } from '../../lib/messages'
import { useEnquiry } from '../providers/contexts'
import { WhatsAppIcon } from '../ui/Icons'

/*
 * The enquiry form is code-split (React Hook Form + Zod load only when needed).
 * The prerendered HTML still contains it, so it is visible before this chunk arrives.
 */

const noopSubscribe = () => () => {}
/** Today's date, resolved on the client only (the prerendered HTML must not bake in the build date). */
const useToday = () => useSyncExternalStore(noopSubscribe, todayISO, () => '')

const inputClass =
  'peer block min-h-13 w-full rounded-[3px] border border-forest/20 bg-white px-4 py-3 text-[0.95rem] text-ink placeholder:text-ink-soft/60 transition-[border-color,box-shadow] duration-300 focus:border-forest focus:outline-none focus:ring-2 focus:ring-gold/50 aria-[invalid=true]:border-red-700/70'

function Field({
  label,
  htmlFor,
  error,
  hint,
  optional,
  className,
  children,
}: {
  label: string
  htmlFor: string
  error?: string
  hint?: string
  optional?: boolean
  className?: string
  children: ReactNode
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-2 flex items-baseline justify-between text-[0.78rem] font-semibold text-forest">
        {label}
        {optional ? <span className="font-normal text-ink-soft">Optional</span> : <span className="sr-only">(required)</span>}
      </label>
      {children}
      {hint && !error && (
        <p id={`${htmlFor}-hint`} className="mt-1.5 text-[0.75rem] text-ink-soft">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${htmlFor}-error`} role="alert" className="mt-1.5 text-[0.78rem] font-medium text-red-800">
          {error}
        </p>
      )}
    </div>
  )
}

type Result = { message: string; url: string | null }

function SuccessPanel({ result, onReset }: { result: Result; onReset: () => void }) {
  const [copied, setCopied] = useState(false)
  const headingRef = useRef<HTMLHeadingElement>(null)
  useEffect(() => headingRef.current?.focus(), [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(result.message)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2400)
    } catch {
      /* Clipboard blocked — the message is visible and selectable below. */
    }
  }

  return (
    <div className="flex h-full flex-col">
      <span className="grid size-14 place-items-center rounded-full bg-forest text-gold-light">
        <Check className="size-6" aria-hidden />
      </span>
      <h3 ref={headingRef} tabIndex={-1} className="text-h3 mt-6 text-forest outline-none">
        {result.url ? 'Your enquiry is ready to send.' : 'Your enquiry message is ready.'}
      </h3>
      <p className="mt-3 text-body text-ink-soft">
        {result.url
          ? 'WhatsApp should now be open with your details filled in — just press send. If it did not open, use the button below.'
          : 'Direct WhatsApp enquiries are not available just yet. Please copy your message and send it to the hotel.'}
      </p>

      <pre className="mt-6 max-h-56 overflow-auto whitespace-pre-wrap rounded-[3px] border border-forest/10 bg-white p-4 font-sans text-[0.82rem] leading-relaxed text-ink">
        {result.message}
      </pre>

      <div className="mt-6 flex flex-wrap gap-3">
        {result.url && (
          <a
            href={result.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center gap-2 rounded-full bg-forest px-6 text-[0.75rem] font-bold uppercase tracking-[0.16em] text-beige transition-colors hover:bg-forest-soft"
          >
            <WhatsAppIcon className="size-4" /> Open WhatsApp
          </a>
        )}
        <button
          type="button"
          onClick={copy}
          className="inline-flex min-h-12 items-center gap-2 rounded-full border border-forest/25 px-5 text-[0.75rem] font-bold uppercase tracking-[0.16em] text-forest transition-colors hover:border-forest"
        >
          <Copy className="size-4" aria-hidden /> <span aria-live="polite">{copied ? 'Copied' : 'Copy message'}</span>
        </button>
        {phoneHref && (
          <a
            href={phoneHref}
            className="inline-flex min-h-12 items-center gap-2 rounded-full border border-forest/25 px-5 text-[0.75rem] font-bold uppercase tracking-[0.16em] text-forest transition-colors hover:border-forest"
          >
            <Phone className="size-4" aria-hidden /> Call
          </a>
        )}
      </div>

      <p className="mt-6 flex gap-2.5 text-[0.8rem] leading-relaxed text-ink-soft">
        <Info className="mt-0.5 size-4 shrink-0 text-gold-deep" aria-hidden />
        {BOOKING_NOTICE}
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-6 self-start text-[0.8rem] font-semibold text-forest underline underline-offset-4"
      >
        Start a new enquiry
      </button>
    </div>
  )
}

export default function BookingForm() {
  const ids = useId()
  const id = (name: string) => `${ids}-${name}`
  const today = useToday()
  const { preferredRoom } = useEnquiry()
  const reducedMotion = usePrefersReducedMotion()
  const [result, setResult] = useState<Result | null>(null)
  const schema = useMemo(() => createBookingSchema(), [])

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    trigger,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(schema),
    mode: 'onTouched',
    defaultValues: { name: '', phone: '', checkIn: '', checkOut: '', guests: 2, room: '', message: '' },
  })

  // A room card's "Enquire" button pre-selects that room here.
  useEffect(() => {
    if (preferredRoom) setValue('room', preferredRoom)
  }, [preferredRoom, setValue])

  const checkIn = useWatch({ control, name: 'checkIn' })
  const minCheckOut = checkIn ? addDaysISO(checkIn, 1) : today ? addDaysISO(today, 1) : undefined

  const onSubmit = (values: BookingFormValues) => {
    const message = buildBookingMessage(values)
    const url = whatsappUrl(message)
    // Popup blockers may refuse this after async validation — the success panel offers a direct link too.
    if (url) window.open(url, '_blank', 'noopener,noreferrer')
    setResult({ message, url })
  }

  const stepGuests = (delta: number) => {
    const current = Number(getValues('guests')) || 0
    const next = Math.min(MAX_GUESTS, Math.max(1, current + delta))
    setValue('guests', next, { shouldValidate: true })
  }

  const describedBy = (name: keyof BookingFormValues, hint?: boolean) =>
    errors[name] ? `${id(name)}-error` : hint ? `${id(name)}-hint` : undefined

  return (
    <div className="relative rounded-[4px] bg-beige p-6 text-ink shadow-[0_40px_90px_-40px_rgba(0,0,0,0.55)] sm:p-9 lg:p-11">
      <AnimatePresence mode="wait" initial={false}>
        {result ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: reducedMotion ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <SuccessPanel
              result={result}
              onReset={() => {
                setResult(null)
                reset()
              }}
            />
          </motion.div>
        ) : (
          <motion.form
            key="form"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            aria-labelledby={id('title')}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: reducedMotion ? 0 : -12 }}
            transition={{ duration: 0.35 }}
          >
            <div className="flex items-center justify-between gap-4">
              <h3 id={id('title')} className="font-serif text-[1.9rem] leading-tight text-forest">
                Booking enquiry
              </h3>
              <CalendarDays className="size-6 text-gold-deep" strokeWidth={1.4} aria-hidden />
            </div>
            <p className="mt-1.5 text-[0.82rem] text-ink-soft">Fields without “Optional” are required.</p>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <Field label="Guest name" htmlFor={id('name')} error={errors.name?.message} className="sm:col-span-2">
                <input
                  id={id('name')}
                  type="text"
                  autoComplete="name"
                  placeholder="Your full name"
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={describedBy('name')}
                  className={inputClass}
                  {...register('name')}
                />
              </Field>

              <Field label="Phone number" htmlFor={id('phone')} error={errors.phone?.message} hint="Include country code if outside India.">
                <input
                  id={id('phone')}
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="+91 98765 43210"
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={describedBy('phone', true)}
                  className={inputClass}
                  {...register('phone')}
                />
              </Field>

              <Field label="Number of guests" htmlFor={id('guests')} error={errors.guests?.message}>
                <div className="flex">
                  <button
                    type="button"
                    onClick={() => stepGuests(-1)}
                    className="grid w-13 shrink-0 place-items-center rounded-l-[3px] border border-r-0 border-forest/20 bg-white text-forest hover:bg-beige-deep"
                    aria-label="Decrease guests"
                  >
                    <Minus className="size-4" aria-hidden />
                  </button>
                  <input
                    id={id('guests')}
                    type="number"
                    inputMode="numeric"
                    min={1}
                    max={MAX_GUESTS}
                    aria-invalid={Boolean(errors.guests)}
                    aria-describedby={describedBy('guests')}
                    className={cn(inputClass, 'rounded-none text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none')}
                    {...register('guests', { valueAsNumber: true })}
                  />
                  <button
                    type="button"
                    onClick={() => stepGuests(1)}
                    className="grid w-13 shrink-0 place-items-center rounded-r-[3px] border border-l-0 border-forest/20 bg-white text-forest hover:bg-beige-deep"
                    aria-label="Increase guests"
                  >
                    <Plus className="size-4" aria-hidden />
                  </button>
                </div>
              </Field>

              <Field label="Check-in" htmlFor={id('checkIn')} error={errors.checkIn?.message}>
                <input
                  id={id('checkIn')}
                  type="date"
                  min={today || undefined}
                  aria-invalid={Boolean(errors.checkIn)}
                  aria-describedby={describedBy('checkIn')}
                  className={inputClass}
                  {...register('checkIn', {
                    onChange: () => {
                      if (getValues('checkOut')) void trigger('checkOut')
                    },
                  })}
                />
              </Field>

              <Field label="Check-out" htmlFor={id('checkOut')} error={errors.checkOut?.message}>
                <input
                  id={id('checkOut')}
                  type="date"
                  min={minCheckOut}
                  aria-invalid={Boolean(errors.checkOut)}
                  aria-describedby={describedBy('checkOut')}
                  className={inputClass}
                  {...register('checkOut')}
                />
              </Field>

              <Field label="Preferred room" htmlFor={id('room')} optional className="sm:col-span-2">
                <select id={id('room')} className={cn(inputClass, 'appearance-none bg-[length:1rem] bg-[right_1rem_center] bg-no-repeat pr-10')} style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23244a36' stroke-width='1.6'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")` }} {...register('room')}>
                  <option value="">No preference</option>
                  {rooms.map((room) => (
                    <option key={room.id} value={roomTitle(room)}>
                      {roomTitle(room)}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Additional message" htmlFor={id('message')} optional error={errors.message?.message} className="sm:col-span-2">
                <textarea
                  id={id('message')}
                  rows={3}
                  placeholder="Arrival time, special requests, travel plans…"
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={describedBy('message')}
                  className={cn(inputClass, 'resize-y')}
                  {...register('message')}
                />
              </Field>
            </div>

            <p className="mt-7 flex gap-2.5 rounded-[3px] border border-gold/40 bg-white/60 p-4 text-[0.8rem] leading-relaxed text-ink-soft">
              <Info className="mt-0.5 size-4 shrink-0 text-gold-deep" aria-hidden />
              {BOOKING_NOTICE}
            </p>

            <button
              type="submit"
              disabled={isSubmitting}
              className="group mt-7 inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-full bg-forest px-8 text-[0.8rem] font-bold uppercase tracking-[0.18em] text-beige transition-colors duration-300 hover:bg-forest-soft disabled:opacity-70"
            >
              {whatsappNumber ? <WhatsAppIcon className="size-4" /> : <Send className="size-4" aria-hidden />}
              {whatsappNumber ? 'Send Enquiry via WhatsApp' : 'Prepare My Enquiry'}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}

