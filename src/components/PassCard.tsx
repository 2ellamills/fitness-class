import React from 'react';
import { format, parseISO } from 'date-fns';
import { Ticket } from 'lucide-react';
import { ClassPass } from '../types';

interface PassCardProps {
  pass: ClassPass;
}

const PassCard: React.FC<PassCardProps> = ({ pass }) => {
  const expiryDate = format(parseISO(pass.expiryDate), 'MMMM d, yyyy');
  
  const getPassTypeLabel = (type: ClassPass['type']) => {
    switch (type) {
      case 'single':
        return 'Single Class Pass';
      case '5-class':
        return '5-Class Pass';
      case '10-class':
        return '10-Class Pass';
      case 'unlimited':
        return 'Unlimited Monthly Pass';
      default:
        return 'Class Pass';
    }
  };
  
  const getPassColor = (type: ClassPass['type']) => {
    switch (type) {
      case 'single':
        return 'bg-blue-100 border-blue-300 text-blue-800';
      case '5-class':
        return 'bg-purple-100 border-purple-300 text-purple-800';
      case '10-class':
        return 'bg-green-100 border-green-300 text-green-800';
      case 'unlimited':
        return 'bg-indigo-100 border-indigo-300 text-indigo-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };
  
  return (
    <div className={`rounded-lg border-2 p-4 ${getPassColor(pass.type)}`}>
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Ticket className="h-6 w-6 mr-2" />
          <h3 className="text-lg font-semibold">{getPassTypeLabel(pass.type)}</h3>
        </div>
        <div className="text-right">
          <span className="text-xl font-bold">
            {pass.type === 'unlimited' ? '∞' : pass.remainingSessions}
          </span>
          <span className="text-sm ml-1">
            {pass.type === 'unlimited' ? '' : 'classes left'}
          </span>
        </div>
      </div>
      <div className="mt-2 text-sm">
        <p>Expires on {expiryDate}</p>
      </div>
    </div>
  );
};

export default PassCard;