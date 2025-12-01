import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const RaiseTicket = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    priority: "",
    description: ""
  });

  const categories = [
    "Electrical",
    "Plumbing",
    "Network",
    "Security",
    "Cleaning",
    "Maintenance",
    "Other"
  ];

  const priorities = [
    { value: "High", label: "High" },
    { value: "Medium", label: "Medium" },
    { value: "Low", label: "Low" }
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
    console.log("Creating ticket:", formData);
    // Here you would typically send the data to your backend
    alert("Ticket created successfully!");
    navigate("/tickets");
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">{t('raiseTicket.heading')}</h1>
        <p className="text-muted-foreground mt-2">{t('tickets.subtitle')}</p>
      </div>

      {/* Form */}
      <div className="bg-card shadow-card rounded-lg border border-border p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
              <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
              {t('raiseTicket.titleLabel')} *
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-foreground mb-2">
                Category *
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
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-foreground mb-2">
                Priority *
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
                    {t(`raiseTicket.priorities.${priority.value.toLowerCase()}`) || priority.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
              <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
              {t('raiseTicket.descriptionLabel')} *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder={t('raiseTicket.placeholder.description')}
              rows={6}
              className="w-full px-3 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
              type="submit"
              className="flex-1 bg-accent-purple hover:bg-accent-purple/90 text-accent-purple-foreground font-medium py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-accent-purple focus:ring-offset-2"
            >
              {t('raiseTicket.create')}
            </button>
            <button
              type="button"
              onClick={() => navigate("/tickets")}
              className="flex-1 bg-muted hover:bg-muted/80 text-muted-foreground font-medium py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-muted focus:ring-offset-2"
            >
              {t('raiseTicket.cancel')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RaiseTicket;