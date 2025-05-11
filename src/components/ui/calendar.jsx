// Calendar.jsx
import PropTypes from 'prop-types'; 
import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import 'react-datepicker/dist/react-datepicker.css';  
import './calendar-overrides.css';

function Calendar({ selected, onChange, className, ...restProps }) {
  const [date, setDate] = useState(selected || new Date());
  useEffect(() => {
    if (selected) setDate(selected);
  }, [selected]);

  const handleChange = (d) => {
    setDate(d);
    onChange?.(d);
  };

  return (
    <DatePicker
      inline
      selected={date}
      onChange={handleChange}
      calendarClassName={cn(
        'calendar-lg  border border-gray-200  ',
             className
        )}

      renderCustomHeader={({
        date: current,
        decreaseMonth,
        increaseMonth,
        prevMonthButtonDisabled,
        nextMonthButtonDisabled,
      }) => (
       <div className="flex items-center  mr-4 ml-4 justify-between h-20">
          <button
            onClick={decreaseMonth}
            disabled={prevMonthButtonDisabled}
            className={buttonVariants({ variant: 'outline', size: 'icon' })}
          >
            <ChevronLeft className="h-6 w-6 text-blue-700" />
          </button>
          <span >
            {current.toLocaleString('default', {
              month: 'long',
              year: 'numeric',
            })}
          </span>
          <button
            onClick={increaseMonth}
            disabled={nextMonthButtonDisabled}
            className={  buttonVariants({ variant: 'outline', size: 'icon' })}
          >
            <ChevronRight className="h-6 w-6 text-green-700  " />
          </button>
        </div>
      )}

      dayClassName={(day) => {
        let classes =
          'flex items-center justify-center w-16 h-16 rounded-md text-lg font-medium transition ';
        // out-of-month days
        if (day.getMonth() !== date.getMonth()) {
          classes += 'text-gray-400 opacity-50';
        } else {
          classes += 'hover:bg-green-100';
        }
        // selected day
        if (day.toDateString() === date.toDateString()) {
          classes += ' bg-green-600 text-white hover:bg-green-700';
        }
        // today
        if (day.toDateString() === new Date().toDateString()) {
          classes += ' border-2 border-green-600 text-white';
        }
        return classes;
      }}

      {...restProps}
    />
  );
}

Calendar.propTypes = {
  selected: PropTypes.instanceOf(Date),
  onChange: PropTypes.func,
  className: PropTypes.string,
};

export { Calendar };
