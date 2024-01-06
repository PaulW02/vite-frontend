import React, {Fragment, useEffect, useState} from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { userService } from './rest/UserService';


const user = {
    name: 'Tom Cook',
    email: 'tom@example.com',
    imageUrl:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
};

const navigation = {
    common: [
        { name: 'Home', href: '/Home', current: false },
    ],
    patient: [
        { name: 'Home', href: '/Home', current: false },
        { name: 'Send Message', href: '/MessageForm', current: false },
        { name: 'See Messages', href: '/Messages', current: false },
        { name: 'My Profile', href: '/Profile', current: false },
    ],
    doctor: [
        { name: 'Home', href: '/Home', current: false },
        { name: 'Send Message', href: '/MessageForm', current: false },
        { name: 'See Messages', href: '/Messages', current: false },
        { name: 'Add Note', href: '/AddNote', current: false },
        { name: 'Get Patient Info', href: '/GetPatient', current: false },
        { name: 'Search Patients', href: '/Search', current: false },
    ],
    employee: [
        { name: 'Home', href: '/Home', current: false },
        { name: 'Send Message', href: '/MessageForm', current: false },
        { name: 'See Messages', href: '/Messages', current: false },
        { name: 'Add Note', href: '/AddNote', current: false },
        { name: 'Search Patients', href: '/Search', current: false },
    ],
};

const userNavigation = [
    { name: 'Your Profile', href: '/Profile' },
    { name: 'Settings', href: '#' },
    { name: 'Sign out', href: '#' },
];

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

function Header() {
    const [userRole, setUserRole] = useState('');
    const location = useLocation();

    useEffect(() => {
        const updateUser = () => {
            const role = localStorage.getItem('role');
            if (role != null && role.length > 0) {
                setUserRole(role);
                console.log(userNavigationOptions)
            }
        };

        updateUser();

        window.addEventListener('storage', updateUser);

        return () => {
            window.removeEventListener('storage', updateUser);
        };
    }, [location]);

    const handleLogout = () => {
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        localStorage.removeItem('role');
        userService.doLogout();
    };

    const isLoggedIn = userRole.length > 0;
    let userNavigationOptions = navigation.common;
    if (!userService.isLoggedIn()){
        console.log("IM not logged in")
        userNavigationOptions = navigation.common;
    }else if(userService.isDoctor()){
        userNavigationOptions = navigation.doctor;
    }else if(userService.isPatient()){
        userNavigationOptions = navigation.patient;
    }else if(userService.isEmployee()){
        userNavigationOptions = navigation.employee;
    }


    return (
        <>
            <Disclosure as="nav" className="bg-gray-800">
                {({ open }) => (
                    <>
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="flex h-16 items-center justify-between">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <img
                                            className="h-8 w-8"
                                            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                                            alt="Your Company"
                                        />
                                    </div>
                                    <div className="hidden md:block">
                                        <div className="ml-10 flex items-baseline space-x-4">
                                            {userNavigationOptions != null ? userNavigationOptions.map((item) => (
                                                <Link
                                                    key={item.name}
                                                    to={item.href}
                                                    className={classNames(
                                                        item.current
                                                            ? 'bg-gray-900 text-white'
                                                            : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                                        'rounded-md px-3 py-2 text-sm font-medium'
                                                    )}
                                                    aria-current={item.current ? 'page' : undefined}
                                                >
                                                    {item.name}
                                                </Link>
                                            )) : (<div></div>)}
                                        </div>
                                    </div>
                                </div>
                                <div className="hidden md:block">
                                    <div className="ml-4 flex items-center md:ml-6">
                                        { userService.isLoggedIn() && (
                                        <>
                                            <button
                                                type="button"
                                                className="relative ml-auto flex-shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                                                onClick={handleLogout}
                                            >
                                                <span className="absolute -inset-1.5" />
                                                <span className="sr-only">Log out</span>
                                                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                            </button>
                                        </>)}

                                    </div>
                                </div>
                                <div className="-mr-2 flex md:hidden">
                                    <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                        <span className="absolute -inset-0.5" />
                                        <span className="sr-only">Open main menu</span>
                                        {open ? (
                                            <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                                        ) : (
                                            <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                                        )}
                                    </Disclosure.Button>
                                </div>
                            </div>
                        </div>
                        <Disclosure.Panel className="md:hidden">
                            <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                                {userNavigationOptions != null ? userNavigationOptions.map((item) => (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        className={classNames(
                                            item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                            'block rounded-md px-3 py-2 text-base font-medium'
                                        )}
                                        aria-current={item.current ? 'page' : undefined}
                                    >
                                        {item.name}
                                    </Link>
                                )) : (<div></div>)}
                            </div>

                            <button
                                type="button"
                                className="relative ml-auto flex-shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                                onClick={handleLogout}
                            >
                                <span className="absolute -inset-1.5" />
                                <span className="sr-only">Log out</span>
                                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                            </button>
                            <div className="border-t border-gray-700 pb-3 pt-4">
                                <div className="flex items-center px-5">
                                    <div className="flex-shrink-0">
                                        <img className="h-10 w-10 rounded-full" src={user.imageUrl} alt="" />
                                    </div>
                                    <div className="ml-3">
                                        <div className="text-base font-medium leading-none text-white">{user.name}</div>
                                        <div className="text-sm font-medium leading-none text-gray-400">{user.email}</div>
                                    </div>

                                </div>
                                <div className="mt-3 space-y-1 px-2">
                                    {userNavigation.map((item) => (
                                        <Link
                                            key={item.name}
                                            to={item.href}
                                            className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                                        >
                                            {item.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </Disclosure.Panel>
                    </>
                )}
            </Disclosure>
        </>
    );
}

export default Header;
