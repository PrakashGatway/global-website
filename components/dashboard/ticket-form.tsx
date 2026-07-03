'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select'
import { ChevronRight, ChevronLeft, Check } from 'lucide-react'

interface TicketFormProps {
  onSubmit: (data: any) => Promise<void>
  onClose: () => void
  isLoading?: boolean
}

export function TicketForm({ onSubmit, onClose, isLoading }: TicketFormProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    subject: '',
    category: 'general',
    description: '',
    priority: 'medium',
    relatedIssue: '',
  })

  const steps = [
    {
      id: 1,
      title: 'Subject & Category',
      description: 'Tell us what your ticket is about',
    },
    {
      id: 2,
      title: 'Description',
      description: 'Provide detailed information',
    },
    {
      id: 3,
      title: 'Priority & Related',
      description: 'Set priority and link related issues',
    },
    {
      id: 4,
      title: 'Review',
      description: 'Review and submit',
    },
  ]

  const handleNext = () => {
    if (step < steps.length) {
      setStep(step + 1)
    }
  }

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  const canProceed = () => {
    if (step === 1) return formData.subject.trim() !== ''
    if (step === 2) return formData.description.trim() !== ''
    if (step === 3) return formData.priority !== ''
    return true
  }

  return (
    <div className="w-full px-3 mx-auto">
      {/* Step Indicator */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center mb-8 gap-2 md:gap-8"
      >
        {steps.map((s, index) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="flex flex-col items-center"
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold transition-all ${
                step > s.id
                  ? 'bg-primary text-primary-foreground'
                  : step === s.id
                    ? 'bg-primary text-primary-foreground ring-2 ring-primary/30'
                    : 'bg-white ring-2 text-muted-foreground'
              }`}
            >
              {step > s.id ? (
                <Check className="w-5 h-5" />
              ) : (
                <span>{s.id}</span>
              )}
            </motion.div>
            <p
              className={`text-xs font-medium mt-2 transition-colors ${
                step >= s.id ? 'text-foreground' : 'text-muted-foreground'
              }`}
            >
              {s.title}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Form Steps */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <AnimatePresence mode="wait">
          {/* Step 1 */}
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div>
                <Label htmlFor="subject" className="text-base font-medium">
                  Subject
                </Label>
                <Input
                  id="subject"
                  placeholder="Brief summary of your issue..."
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  className="mt-2 px-4 py-2.5"
                />
              </div>

              <div>
                <Label htmlFor="category" className="text-base font-medium">
                  Category
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Inquiry</SelectItem>
                    <SelectItem value="billing">Billing</SelectItem>
                    <SelectItem value="technical">Technical Support</SelectItem>
                    <SelectItem value="feature">Feature Request</SelectItem>
                    <SelectItem value="bug">Bug Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </motion.div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div>
                <Label htmlFor="description" className="text-base font-medium">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Please provide detailed information about your issue..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="mt-2 min-h-32"
                />
              </div>
            </motion.div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div>
                <Label htmlFor="priority" className="text-base font-medium">
                  Priority
                </Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) =>
                    setFormData({ ...formData, priority: value })
                  }
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="related" className="text-base font-medium">
                  Related Issue (Optional)
                </Label>
                <Input
                  id="related"
                  placeholder="Ticket ID or reference..."
                  value={formData.relatedIssue}
                  onChange={(e) =>
                    setFormData({ ...formData, relatedIssue: e.target.value })
                  }
                  className="mt-2 py-2.5"
                />
              </div>
            </motion.div>
          )}

          {/* Step 4 - Review */}
          {step === 4 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className=""
            >
              <div className="bg-gray-100 rounded-lg p-6 space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">
                    SUBJECT
                  </p>
                  <p className="text-foreground font-semibold mt-1">
                    {formData.subject}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">
                      CATEGORY
                    </p>
                    <p className="text-foreground font-semibold mt-1 capitalize">
                      {formData.category}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">
                      PRIORITY
                    </p>
                    <p className="text-foreground font-semibold mt-1 capitalize">
                      {formData.priority}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground font-medium">
                    DESCRIPTION
                  </p>
                  <p className="text-foreground mt-1 text-sm">
                    {formData.description}
                  </p>
                </div>

                {formData.relatedIssue && (
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">
                      RELATED ISSUE
                    </p>
                    <p className="text-foreground font-semibold mt-1">
                      {formData.relatedIssue}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="absolute bottom-0 left-0 right-0 px-6 py-4 w-full flex justify-between border-t"
        >
          <Button
            type="button"
            variant="outline"
            onClick={handlePrev}
            disabled={step === 1}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {step < 4 ? (
            <Button
              type="button"
              onClick={handleNext}
              disabled={!canProceed()}
              className="gap-2"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isLoading}
              className="gap-2"
            >
              {isLoading ? 'Submitting...' : 'Submit Ticket'}
              <Check className="w-4 h-4" />
            </Button>
          )}
        </motion.div>
      </form>
    </div>
  )
}
