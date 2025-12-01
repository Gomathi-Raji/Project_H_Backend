import { useState } from "react";
import { useTranslation } from 'react-i18next';
import { X } from "lucide-react";

const RaiseTicketModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    priority: "",
    description: ""
  });

  const categories = [
    { value: "technical", label: "Technical Issue" },
    { value: "payment", label: "Payment Issue" },
    { value: "maintenance", label: "Maintenance" },
    { value: "complaint", label: "Complaint" },
    { value: "security", label: "Security" },
    { value: "plumbing", label: "Plumbing" },
    { value: "other", label: "Other" }
  ];

  const priorities = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" }
  ];

  const { t } = useTranslation();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      title: "",
      category: "",
      priority: "",
      description: ""
    });
  };

  const handleCancel = () => {
    setFormData({
      title: "",
      category: "",
      priority: "",
      description: ""
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-card shadow-lg rounded-lg border border-border w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">{t('raiseTicket.heading')}</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
              <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
              {t('raiseTicket.titleLabel')} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder={t('raiseTicket.placeholder.title')}
              className="w-full px-3 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              required
            />
          </div>

          {/* Category */}
          <div>
              <label htmlFor="category" className="block text-sm font-medium text-foreground mb-2">
              {t('raiseTicket.categoryLabel')} <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              required
            >
              <option value="">{t('raiseTicket.categoryLabel')}</option>
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {t(`raiseTicket.categories.${category.value}`) || category.label}
                </option>
              ))}
            </select>
          </div>

          {/* Priority */}
          <div>
              <label htmlFor="priority" className="block text-sm font-medium text-foreground mb-2">
              {t('raiseTicket.priorityLabel')} <span className="text-red-500">*</span>
            </label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              required
            >
              <option value="">{t('raiseTicket.priorityLabel')}</option>
              {priorities.map((priority) => (
                <option key={priority.value} value={priority.value}>
                  {t(`raiseTicket.priorities.${priority.value}`) || priority.label}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
              <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
              {t('raiseTicket.descriptionLabel')} <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder={t('raiseTicket.placeholder.description')}
              rows={4}
              className="w-full px-3 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex space-x-3 pt-4">
              <button
              type="submit"
              className="flex-1 bg-accent-purple hover:bg-accent-purple/90 text-accent-purple-foreground font-medium py-2 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-accent-purple focus:ring-offset-2"
            >
              {t('raiseTicket.create')}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 bg-muted hover:bg-muted/80 text-muted-foreground font-medium py-2 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-muted focus:ring-offset-2"
            >
              {t('raiseTicket.cancel')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RaiseTicketModal;
