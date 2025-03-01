import React, { useState } from 'react';
import { format, parseISO, isToday, isTomorrow, addDays } from 'date-fns';
import { Calendar, Filter } from 'lucide-react';
import { useClasses } from '../context/ClassContext';
import { useAuth } from '../context/AuthContext';
import ClassCard from '../components/ClassCard';
import PassCard from '../components/PassCard';

const ClassesPage: React.FC = () => {
  const { classes, userPasses, purchasePass } = useClasses();
  const { currentUser } = useAuth();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showPassModal, setShowPassModal] = useState(false);
  const [filterMyClasses, setFilterMyClasses] = useState(false);

  // Group classes by date
  const classesByDate = classes.reduce((acc, cls) => {
    if (!acc[cls.date]) {
      acc[cls.date] = [];
    }
    acc[cls.date].push(cls);
    return acc;
  }, {} as Record<string, typeof classes>);

  // Sort dates
  const sortedDates = Object.keys(classesByDate).sort((a, b) => {
    return new Date(a).getTime() - new Date(b).getTime();
  });

  // Format date for display
  const formatDateHeading = (dateStr: string) => {
    const date = parseISO(dateStr);
    if (isToday(date)) {
      return 'Today';
    } else if (isTomorrow(date)) {
      return 'Tomorrow';
    } else {
      return format(date, 'EEEE, MMMM d');
    }
  };

  // Filter classes based on selected date and "My Classes" filter
  const filteredClasses = selectedDate
    ? classesByDate[selectedDate]
    : Object.values(classesByDate).flat();

  const displayedClasses = filterMyClasses && currentUser
    ? filteredClasses.filter(cls => cls.participants.includes(currentUser.id))
    : filteredClasses;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">
            Available Classes
          </h1>
          
          <div className="flex flex-col sm:flex-row gap-4">
            {currentUser && (
              <button
                onClick={() => setShowPassModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Purchase Pass
              </button>
            )}
            
            <div className="relative">
              <button
                onClick={() => setFilterMyClasses(!filterMyClasses)}
                className={`inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md shadow-sm ${
                  filterMyClasses
                    ? 'bg-indigo-100 text-indigo-700 border-indigo-300'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Filter className="h-4 w-4 mr-2" />
                {filterMyClasses ? 'My Classes' : 'All Classes'}
              </button>
            </div>
          </div>
        </div>

        {/* User passes section */}
        {currentUser && userPasses.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Passes</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {userPasses.map((pass) => (
                <PassCard key={pass.id} pass={pass} />
              ))}
            </div>
          </div>
        )}

        {/* Date filter tabs */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex space-x-2 pb-2">
            <button
              onClick={() => setSelectedDate(null)}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                selectedDate === null
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              All Days
            </button>
            
            {sortedDates.map((date) => (
              <button
                key={date}
                onClick={() => setSelectedDate(date)}
                className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
                  selectedDate === date
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {formatDateHeading(date)}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Classes grid */}
        {displayedClasses.length > 0 ? (
          <div>
            {selectedDate ? (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  {formatDateHeading(selectedDate)}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {classesByDate[selectedDate].map((cls) => (
                    <ClassCard key={cls.id} classItem={cls} />
                  ))}
                </div>
              </div>
            ) : (
              <>
                {sortedDates.map((date) => {
                  const classesForDate = filterMyClasses && currentUser
                    ? classesByDate[date].filter(cls => cls.participants.includes(currentUser.id))
                    : classesByDate[date];
                  
                  if (classesForDate.length === 0) return null;
                  
                  return (
                    <div key={date} className="mb-10">
                      <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        {formatDateHeading(date)}
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {classesForDate.map((cls) => (
                          <ClassCard key={cls.id} classItem={cls} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {filterMyClasses
                ? "You haven't booked any classes yet."
                : "No classes available for the selected filters."}
            </p>
          </div>
        )}
      </div>

      {/* Purchase Pass Modal */}
      {showPassModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Purchase a Class Pass</h3>
            
            <div className="space-y-4">
              <button
                onClick={() => {
                  purchasePass('single');
                  setShowPassModal(false);
                }}
                className="w-full text-left px-4 py-3 border rounded-md hover:bg-gray-50"
              >
                <div className="font-medium">Single Class Pass</div>
                <div className="text-sm text-gray-500">Valid for 30 days</div>
              </button>
              
              <button
                onClick={() => {
                  purchasePass('5-class');
                  setShowPassModal(false);
                }}
                className="w-full text-left px-4 py-3 border rounded-md hover:bg-gray-50"
              >
                <div className="font-medium">5-Class Pass</div>
                <div className="text-sm text-gray-500">Valid for 60 days</div>
              </button>
              
              <button
                onClick={() => {
                  purchasePass('10-class');
                  setShowPassModal(false);
                }}
                className="w-full text-left px-4 py-3 border rounded-md hover:bg-gray-50"
              >
                <div className="font-medium">10-Class Pass</div>
                <div className="text-sm text-gray-500">Valid for 90 days</div>
              </button>
              
              <button
                onClick={() => {
                  purchasePass('unlimited');
                  setShowPassModal(false);
                }}
                className="w-full text-left px-4 py-3 border rounded-md hover:bg-gray-50"
              >
                <div className="font-medium">Unlimited Monthly Pass</div>
                <div className="text-sm text-gray-500">Valid for 30 days</div>
              </button>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowPassModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassesPage;