import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import axios from 'axios';

const DateTimeSelector = () => {
  const { subServiceId } = useParams();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);
  const [blockedTimes, setBlockedTimes] = useState([]);
  const [bookedTimes, setBookedTimes] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const weekdays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const timeSlots = [
    '11:00 AM',
    '12:00 PM',
    '1:00 PM',
    '2:00 PM',
    '3:00 PM',
  ];

  const navigate = useNavigate();

  useEffect(() => {
  const interval = setInterval(() => {
    if (selectedDate) {
      // Re-fetch blocked and booked times
    }
  }, 30000); // every 30 seconds
  return () => clearInterval(interval);
}, [selectedDate]);

  useEffect(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    // Get first day of month and total days in month
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();

    // Get day of week for first day (0 = Sunday, 6 = Saturday)
    const firstDayWeekday = firstDayOfMonth.getDay();

    // Create array of calendar days
    const days = [];

    // Add empty slots for days before the first day of month
    for (let i = 0; i < firstDayWeekday; i++) {
      days.push({ date: null });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Add actual days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const fullDate = new Date(year, month, day);
      const isPastDate = fullDate < today;

      days.push({
        date: day,
        fullDate: fullDate,
        isDisabled: isPastDate
      });
    }

    setCalendarDays(days);

  }, [currentMonth]);

  // Fetch blocked and booked times when date changes
  useEffect(() => {
    if (!selectedDate) return;

    const fetchTimeSlots = async () => {
      setLoading(true);
      try {
        const year = currentMonth.getFullYear();
        const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
        const day = String(selectedDate).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;

        // Fetch both blocked and booked times in parallel
        const [blockedRes, bookedRes] = await Promise.all([
          axios.get(`/api/blocked-slots/blocked-times?date=${formattedDate}&subServiceId=${subServiceId}`),
          axios.get(`/api/appointments/booked-times?date=${formattedDate}&subServiceId=${subServiceId}`)
        ]);

        console.log('Blocked times:', blockedRes.data.blockedTimes);
        console.log('Booked times:', bookedRes.data.bookedTimes);

        setBlockedTimes(blockedRes.data.blockedTimes || []);
        setBookedTimes(bookedRes.data.bookedTimes || []);
      } catch (error) {
        console.error('Error fetching time slots:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTimeSlots();
  }, [selectedDate, subServiceId, currentMonth]);

  const formatMonthYear = () => {
    const options = { month: 'long', year: 'numeric' };
    return currentMonth.toLocaleDateString('en-US', options);
  };

  const handlePrevMonth = () => {
    const prevMonth = new Date(currentMonth);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    setCurrentMonth(prevMonth);
  };

  const handleNextMonth = () => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setCurrentMonth(nextMonth);
  };

  const handleDateSelect = (date) => {
    const dayObj = calendarDays.find(d => d.date === date);
    if (dayObj && !dayObj.isDisabled) {
      setSelectedDate(date);
      // Reset selected time when date changes
      setSelectedTime(null);
    }
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };


  // In your DateTimeSelector component, update the time slot handling:

  const isTimeDisabled = (time) => {
    // First check quick disqualifiers
    const time24 = convertTo24Hour(time);

    // Check against blocked times (convert each to 24h format for comparison)
    const isBlocked = blockedTimes.some(blockedTime => {
      return convertTo24Hour(blockedTime) === time24;
    });

    // Check against booked times (convert each to 24h format for comparison)
    const isBooked = bookedTimes.some(bookedTime => {
      return convertTo24Hour(bookedTime) === time24;
    });

    if (isBlocked || isBooked) {
      return true;
    }

    // Then check time-based constraints
    if (selectedDate) {
      const [hours, minutes] = time24.split(':').map(Number);
      const selectedDateTime = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        selectedDate,
        hours,
        minutes
      );

      const now = new Date();
      const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);

      // Only apply 1-hour rule for the current day
      if (
        selectedDateTime.toDateString() === now.toDateString() &&
        selectedDateTime < oneHourFromNow
      ) {
        return true;
      }
    }

    return false;
  };

  // Add this helper function to the component
  const convertTo24Hour = (timeStr) => {
    if (!timeStr) return "00:00";

    // Handle case if it's already in 24h format
    if (timeStr.match(/^\d{2}:\d{2}$/)) {
      return timeStr;
    }

    const timeMatch = timeStr.match(/(\d{1,2}):(\d{2}) (AM|PM)/i);
    if (!timeMatch) return "00:00";

    let hours = parseInt(timeMatch[1], 10);
    const minutes = timeMatch[2];
    const period = timeMatch[3].toUpperCase();

    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;

    return `${hours.toString().padStart(2, '0')}:${minutes}`;
  };


  const handleConfirm = async () => {
    if (!user) {
      navigate("/login", { state: { returnTo: window.location.pathname } });
      return;
    }

    if (selectedDate && selectedTime) {
      const selectedDateObj = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        selectedDate
      );

      const formattedDate = `${selectedDateObj.getFullYear()}-${String(selectedDateObj.getMonth() + 1).padStart(2, '0')}-${String(selectedDateObj.getDate()).padStart(2, '0')}`;

      // Navigate to confirmation page with selected data
      navigate(`/confirmation/${subServiceId}`, {
        state: {
          userId: user._id,
          subServiceId: subServiceId,
          appointmentDate: formattedDate,
          appointmentTime: selectedTime,
        },
      });
    } else {
      console.log("Please select both date and time.");
    }
  };



  return (
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold text-center my-8">Book your appointment now</h1>
      <h2 className="text-2xl font-medium mb-8">Select Date and Time</h2>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Calendar Section */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <div className="text-3xl font-bold flex items-center">
              {formatMonthYear()}
              <button className="ml-2 text-blue-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            <div className="flex">
              <button onClick={handlePrevMonth} className="text-blue-500 p-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button onClick={handleNextMonth} className="text-blue-500 p-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-4 mb-6">
            {weekdays.map((day) => (
              <div key={day} className="text-center text-gray-400 font-medium">
                {day}
              </div>
            ))}

            {calendarDays.map((item, index) => (
              <div key={index} className="text-center">
                {item.date && (
                  <button
                    onClick={() => handleDateSelect(item.date)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl font-medium ${selectedDate === item.date
                      ? 'bg-blue-100 text-blue-500'
                      : item.isDisabled
                        ? 'bg-gray-200 cursor-not-allowed'
                        : 'hover:bg-gray-100'
                      }`}
                    disabled={item.isDisabled}
                  >
                    {item.date}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="md:w-64">
          <h3 className="text-2xl font-medium mb-4">Available Time Slots</h3>
          {loading ? (
            <div className="text-center py-4">Loading available times...</div>
          ) : selectedDate ? (
            <div className="flex flex-col gap-4">
              {timeSlots.map(time => {
                const isDisabled = isTimeDisabled(time);
                const isBlocked = blockedTimes.some(t => convertTo24Hour(t) === convertTo24Hour(time));
                const isBooked = bookedTimes.some(t => convertTo24Hour(t) === convertTo24Hour(time));

                return (
                  <button
                    key={time}
                    onClick={() => !isDisabled && handleTimeSelect(time)}
                    disabled={isDisabled}
                    className={`py-4 px-6 border rounded-lg text-xl text-center ${selectedTime === time ? 'bg-blue-100 text-blue-500 border-blue-200' : ''
                      } ${isDisabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'hover:bg-gray-50 border-gray-300'
                      }`}
                    title={isDisabled ?
                      (isBlocked ? "This time is blocked by admin" :
                        isBooked ? "This time is already booked" :
                          "This time is not available") :
                      "Available"}
                  >
                    {time}
                    {isDisabled && (
                      <span className="text-sm text-red-400 ml-1">
                        ({isBlocked ? "Blocked" : isBooked ? "Booked" : "Unavailable"})
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">Please select a date first</div>
          )}

          <button
            onClick={handleConfirm}
            disabled={!selectedDate || !selectedTime}
            className={`mt-8 py-3 px-8 bg-pink-500 text-white rounded-full text-xl font-medium w-full ${(!selectedDate || !selectedTime) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-pink-600 transition-colors'
              }`}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default DateTimeSelector;