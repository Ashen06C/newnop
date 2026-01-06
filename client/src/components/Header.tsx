import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../features/auth/authSlice';
import type { AppDispatch, RootState } from '../store';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut } from 'lucide-react';

const Header = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth);

    const onLogout = () => {
        dispatch(logout());
        dispatch(reset());
        navigate('/login');
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-gradient-to-r from-black to-neutral-700 text-white shadow-md">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link to="/" className="text-2xl font-bold tracking-tight flex items-center gap-2">
                    Issue Tracker
                </Link>

                <nav className="flex items-center gap-4">
                    {user ? (
                        <>
                            <Button variant="ghost" className="text-white hover:bg-white/20 hover:text-white" asChild>
                                <Link to="/">Dashboard</Link>
                            </Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-8 w-8 rounded-full cursor-pointer hover:bg-white/20">
                                        <Avatar className="h-8 w-8 border-2 border-white/50">
                                            <AvatarImage src="/avatars/01.png" alt="@shadcn" />
                                            <AvatarFallback className="text-black">{user.name ? user.name.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end" forceMount>
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">{user.name}</p>
                                            <p className="text-xs leading-none text-muted-foreground">
                                                {user.email}
                                            </p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={onLogout}>
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Log out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    ) : (
                        <>
                            <Button variant="ghost" className="text-white hover:bg-white/20 hover:text-white" asChild>
                                <Link to="/login">Login</Link>
                            </Button>
                            <Button className="bg-white text-black hover:bg-gray-200" asChild>
                                <Link to="/register">Register</Link>
                            </Button>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;
