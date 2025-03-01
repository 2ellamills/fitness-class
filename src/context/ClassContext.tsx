import React, { createContext, useState, useContext, useEffect } from 'react';
import { format, addDays } from 'date-fns';
import { Class, ClassPass } from '../types';
import { useAuth } from './AuthContext';

interface ClassContextType {
  classes: Class[];
  userPasses: ClassPass[];
  loading: boolean;
  bookClass: (classId: string) => void;
  cancelBooking: (classId: string) => void;
  purchasePass: (type: ClassPass['type']) => void;
  getAvailablePasses: () => ClassPass[];
}

const ClassContext = createContext<ClassContextType | undefined>(undefined);

// Generate mock classes
const generateMockClasses = (): Class[] => {
  const classTypes = [
    {
      title: 'Yoga Flow',
      description: 'A dynamic practice that connects breath with movement',
      instructor: 'Sarah Johnson',
      imageUrl: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b',
    },
    {
      title: 'HIIT Training',
      description: 'High-intensity interval training to boost your metabolism',
      instructor: 'Mike Peterson',
      imageUrl: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2',
    },
    {
      title: 'Pilates',
      description: 'Focus on core strength, posture, and flexibility',
      instructor: 'Emma Davis',
      imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a',
    },
    {
      title: 'Meditation',
      description: 'Guided meditation for stress relief and mental clarity',
      instructor: 'David Chen',
      imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773',
    },
  ];

  const times = ['07:00', '09:30', '12:00', '17:30', '19:00'];
  const classes: Class[] = [];

  // Generate classes for the next 7 days
  for (let day = 0; day < 7; day++) {
    const date = format(addDays(new Date(), day), 'yyyy-MM-dd');
    
    // Add 2-3 classes per day
    const numClasses = 2 + Math.floor(Math.random() * 2);
    const dayTimes = [...times].sort(() => 0.5 - Math.random()).slice(0, numClasses);
    
    for (let i = 0; i < numClasses; i++) {
      const classType = classTypes[Math.floor(Math.random() * classTypes.length)];
      classes.push({
        id: `class-${date}-${i}`,
        title: classType.title,
        description: classType.description,
        instructor: classType.instructor,
        date,
        time: dayTimes[i],
        duration: 60,
        capacity: 15 + Math.floor(Math.random() * 10),
        participants: [],
        imageUrl: classType.imageUrl,
      });
    }
  }

  return classes;
};

// Track which pass was used for each booking
interface BookingRecord {
  classId: string;
  passId: string;
}

export const ClassProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [classes, setClasses] = useState<Class[]>([]);
  const [userPasses, setUserPasses] = useState<ClassPass[]>([]);
  const [bookingRecords, setBookingRecords] = useState<BookingRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load mock classes
    setClasses(generateMockClasses());
    
    // Load user passes and booking records from localStorage if available
    if (currentUser) {
      const storedPasses = localStorage.getItem(`passes-${currentUser.id}`);
      if (storedPasses) {
        setUserPasses(JSON.parse(storedPasses));
      }
      
      const storedBookings = localStorage.getItem(`bookings-${currentUser.id}`);
      if (storedBookings) {
        setBookingRecords(JSON.parse(storedBookings));
      }
    } else {
      setUserPasses([]);
      setBookingRecords([]);
    }
    
    setLoading(false);
  }, [currentUser]);

  // Save passes and booking records to localStorage whenever they change
  useEffect(() => {
    if (currentUser) {
      if (userPasses.length > 0) {
        localStorage.setItem(`passes-${currentUser.id}`, JSON.stringify(userPasses));
      }
      
      if (bookingRecords.length > 0) {
        localStorage.setItem(`bookings-${currentUser.id}`, JSON.stringify(bookingRecords));
      }
    }
  }, [userPasses, bookingRecords, currentUser]);

  const bookClass = (classId: string) => {
    if (!currentUser) return;

    setClasses((prevClasses) => {
      return prevClasses.map((cls) => {
        if (cls.id === classId && !cls.participants.includes(currentUser.id)) {
          // Check if class is full
          if (cls.participants.length >= cls.capacity) {
            alert('This class is full. Please choose another class.');
            return cls;
          }
          
          // Check if user has an available pass
          const availablePasses = userPasses.filter(p => p.remainingSessions > 0);
          if (availablePasses.length === 0) {
            alert('You need to purchase a pass to book this class.');
            return cls;
          }
          
          // Deduct from pass - use the pass that expires soonest
          const passToUpdate = [...availablePasses].sort((a, b) => {
            // Use passes that expire sooner first
            return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
          })[0];
          
          setUserPasses((prevPasses) => {
            return prevPasses.map((pass) => {
              if (pass.id === passToUpdate.id) {
                return {
                  ...pass,
                  remainingSessions: pass.remainingSessions - 1,
                };
              }
              return pass;
            });
          });
          
          // Record which pass was used for this booking
          setBookingRecords((prevRecords) => [
            ...prevRecords,
            { classId, passId: passToUpdate.id }
          ]);
          
          // Add user to class participants
          return {
            ...cls,
            participants: [...cls.participants, currentUser.id],
          };
        }
        return cls;
      });
    });
  };

  const cancelBooking = (classId: string) => {
    if (!currentUser) return;

    setClasses((prevClasses) => {
      return prevClasses.map((cls) => {
        if (cls.id === classId && cls.participants.includes(currentUser.id)) {
          // Find the booking record for this class
          const bookingRecord = bookingRecords.find(record => record.classId === classId);
          
          if (bookingRecord) {
            // Refund the specific pass that was used
            setUserPasses((prevPasses) => {
              return prevPasses.map((pass) => {
                if (pass.id === bookingRecord.passId) {
                  return {
                    ...pass,
                    remainingSessions: pass.remainingSessions + 1,
                  };
                }
                return pass;
              });
            });
            
            // Remove the booking record
            setBookingRecords((prevRecords) => 
              prevRecords.filter(record => record.classId !== classId)
            );
          }
          
          // Remove user from class participants
          return {
            ...cls,
            participants: cls.participants.filter((id) => id !== currentUser.id),
          };
        }
        return cls;
      });
    });
  };

  const purchasePass = (type: ClassPass['type']) => {
    if (!currentUser) return;

    const passDetails = {
      'single': { sessions: 1, expiryDays: 30 },
      '5-class': { sessions: 5, expiryDays: 60 },
      '10-class': { sessions: 10, expiryDays: 90 },
      'unlimited': { sessions: 999, expiryDays: 30 },
    };

    const newPass: ClassPass = {
      id: `pass-${Date.now()}`,
      userId: currentUser.id,
      type,
      remainingSessions: passDetails[type].sessions,
      expiryDate: format(addDays(new Date(), passDetails[type].expiryDays), 'yyyy-MM-dd'),
    };

    setUserPasses((prevPasses) => [...prevPasses, newPass]);
  };

  const getAvailablePasses = () => {
    if (!currentUser) return [];
    return userPasses.filter((pass) => pass.remainingSessions > 0);
  };

  const value = {
    classes,
    userPasses,
    loading,
    bookClass,
    cancelBooking,
    purchasePass,
    getAvailablePasses,
  };

  return <ClassContext.Provider value={value}>{children}</ClassContext.Provider>;
};

export const useClasses = () => {
  const context = useContext(ClassContext);
  if (context === undefined) {
    throw new Error('useClasses must be used within a ClassProvider');
  }
  return context;
};