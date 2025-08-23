import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const DashboardCard = ({ 
  children, 
  className, 
  title, 
  subtitle, 
  icon: Icon,
  gradient = false,
  variant = 'default',
  ...props 
}) => {
  const cardVariants = {
    default: "bg-card border border-border",
    glass: "glass-effect",
    gradient: "bg-gradient-to-br from-card via-card to-muted/20",
    elevated: "bg-card border border-border shadow-lg hover:shadow-xl"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "dashboard-card rounded-xl p-6 transition-all duration-200",
        cardVariants[variant],
        className
      )}
      {...props}
    >
      {(title || Icon) && (
        <div className="flex items-center gap-3 mb-4">
          {Icon && (
            <div className="p-2 bg-primary/10 rounded-lg">
              <Icon className="w-5 h-5 text-primary" />
            </div>
          )}
          <div>
            {title && (
              <h3 className="text-lg font-semibold text-card-foreground">{title}</h3>
            )}
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
        </div>
      )}
      {children}
    </motion.div>
  );
};

const MetricCard = ({ 
  title, 
  value, 
  change, 
  changeType = 'neutral',
  icon: Icon,
  className,
  variant = 'default',
  ...props 
}) => {
  const changeColors = {
    positive: 'text-emerald-600 dark:text-emerald-400',
    negative: 'text-red-600 dark:text-red-400',
    neutral: 'text-muted-foreground'
  };

  const iconVariants = {
    default: "bg-primary/10 text-primary",
    success: "bg-emerald-500/10 text-emerald-600",
    warning: "bg-amber-500/10 text-amber-600",
    danger: "bg-red-500/10 text-red-600",
    info: "bg-blue-500/10 text-blue-600"
  };

  return (
    <DashboardCard 
      variant={variant}
      className={cn("relative overflow-hidden", className)} 
      {...props}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-card-foreground">{value}</p>
          {change && (
            <p className={cn("text-xs font-medium", changeColors[changeType])}>
              {change}
            </p>
          )}
        </div>
        {Icon && (
          <div className={cn("p-3 rounded-lg", iconVariants.default)}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
      {/* Subtle background pattern */}
      <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl" />
    </DashboardCard>
  );
};

const ChartCard = ({ 
  title, 
  children, 
  className, 
  actions,
  variant = 'default',
  ...props 
}) => {
  return (
    <DashboardCard variant={variant} className={className} {...props}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-card-foreground">{title}</h3>
        {actions && (
          <div className="flex items-center gap-2">
            {actions}
          </div>
        )}
      </div>
      <div className="h-[300px]">
        {children}
      </div>
    </DashboardCard>
  );
};

const DataCard = ({ 
  title, 
  children, 
  className, 
  actions,
  variant = 'default',
  ...props 
}) => {
  return (
    <DashboardCard variant={variant} className={className} {...props}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-card-foreground">{title}</h3>
        {actions && (
          <div className="flex items-center gap-2">
            {actions}
          </div>
        )}
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </DashboardCard>
  );
};

const StatsGrid = ({ children, className, ...props }) => {
  return (
    <div 
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6",
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
};

const ContentGrid = ({ children, className, cols = 2, ...props }) => {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 lg:grid-cols-2",
    3: "grid-cols-1 lg:grid-cols-3",
    4: "grid-cols-1 lg:grid-cols-2 xl:grid-cols-4"
  };

  return (
    <div 
      className={cn(
        "grid gap-6",
        gridCols[cols],
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
};

export { DashboardCard, MetricCard, ChartCard, DataCard, StatsGrid, ContentGrid };