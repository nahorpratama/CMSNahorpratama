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
  ...props 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "dashboard-card",
        gradient && "bg-gradient-to-br from-card via-card to-muted/20",
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
  ...props 
}) => {
  const changeColors = {
    positive: 'text-emerald-600 dark:text-emerald-400',
    negative: 'text-red-600 dark:text-red-400',
    neutral: 'text-muted-foreground'
  };

  return (
    <DashboardCard className={cn("relative overflow-hidden", className)} {...props}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-card-foreground">{value}</p>
          {change && (
            <p className={cn("text-xs", changeColors[changeType])}>
              {change}
            </p>
          )}
        </div>
        {Icon && (
          <div className="p-3 bg-primary/10 rounded-lg">
            <Icon className="w-6 h-6 text-primary" />
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
  ...props 
}) => {
  return (
    <DashboardCard className={className} {...props}>
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

export { DashboardCard, MetricCard, ChartCard, StatsGrid };