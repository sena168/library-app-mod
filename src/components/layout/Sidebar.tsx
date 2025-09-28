import { Link, useLocation } from 'react-router-dom';
import { X, Home, BookOpen, History, User, ShoppingCart } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store';
import { setSidebarOpen } from '../../store/slices/uiSlice';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';

interface SidebarProps {
  isOpen: boolean;
}

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Books', href: '/books', icon: BookOpen },
  { name: 'My Loans', href: '/loans', icon: History },
  { name: 'Cart', href: '/cart', icon: ShoppingCart },
  { name: 'Profile', href: '/profile', icon: User },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const closeSidebar = () => {
    dispatch(setSidebarOpen(false));
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className='fixed inset-0 z-20 bg-black/50 lg:hidden'
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-border transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className='flex items-center justify-between p-4 lg:hidden'>
          <h2 className='text-lg font-semibold'>Menu</h2>
          <Button variant='ghost' size='sm' onClick={closeSidebar}>
            <X className='h-5 w-5' />
          </Button>
        </div>

        <nav className='p-4 space-y-2'>
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={closeSidebar}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                )}
              >
                <item.icon className='h-5 w-5' />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
};
