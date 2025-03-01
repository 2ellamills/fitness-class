import React from 'react';
import { format, parseISO } from 'date-fns';
import { Users } from 'lucide-react';
import { Class } from '../types';
import { useAuth } from '../context/AuthContext';
import { useClasses } from '../context/ClassContext';

interface ClassCardProps {
  classItem: Class;
}

const ClassCard: React.FC<ClassCardProps> = ({ classItem }) => {
  const { currentUser } = useAuth();
  const { bookClass, cancelBooking, getAvailablePasses } = useClasses();
  
  const isBooked = currentUser && classItem.participants.includes(currentUser.id);
  const availablePasses = getAvailablePasses();
  const spotsRemaining = classItem.capacity - classItem.participants.length;
  
  const handleBooking = () => {
    if (isBooked) {
      cancelBooking(classItem.id);
    } else {
      bookClass(classItem.id);
    }
  };
  
  const formattedDate = format(parseISO(classItem.date), 'EEEE, MMMM d, yyyy');
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="h-48 overflow-hidden">
        <img 
          src={`${classItem.imageUrl}?w=600&h=400&fit=crop`} 
          alt={classItem.title} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-semibold text-gray-800">{classItem.title}</h3>
          <div className="flex items-center text-sm text-gray-600">
            <Users className="h-4 w-4 mr-1" />
            <span>{classItem.participants.length}/{classItem.capacity}</span>
          </div>
        </div>
        <p className="text-gray-600 mt-1">{classItem.description}</p>
        <div className="mt-3">
          <p className="text-gray-700">
            <span className="font-medium">Instructor:</span> {classItem.instructor}
          </p>
          <p className="text-gray-700">
            <span className="font-medium">Date:</span> {formattedDate}
          </p>
          <p className="text-gray-700">
            <span className="font-medium">Time:</span> {classItem.time}
          </p>
          <p className="text-gray-700">
            <span className="font-medium">Duration:</span> {classItem.duration} minutes
          </p>
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <span className={`px-2 py-1 rounded text-sm ${
            spotsRemaining > 5 
              ? 'bg-green-100 text-green-800' 
              : spotsRemaining > 0 
                ? 'bg-yellow-100 text-yellow-800' 
                : 'bg-red-100 text-red-800'
          }`}>
            {spotsRemaining > 0 
              ? `${spotsRemaining} spots left` 
              : 'Class full'}
          </span>
          
          {currentUser && (
            <button
              onClick={handleBooking}
              disabled={!isBooked && (spotsRemaining === 0 || availablePasses.length === 0)}
              className={`px-4 py-2 rounded-md ${
                isBooked
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : spotsRemaining === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : availablePasses.length === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-indigo-500 hover:bg-indigo-600 text-white'
              }`}
            >
              {isBooked ? 'Cancel' : spotsRemaining === 0 ? 'Full' : 'Book'}
            </button>
          )}
        </div>
        
        {currentUser && !isBooked && availablePasses.length === 0 && (
          <p className="mt-2 text-sm text-red-500">
            You need to purchase a pass to book this class.
          </p>
        )}
      </div>
    </div>
  );
};

export default ClassCard;