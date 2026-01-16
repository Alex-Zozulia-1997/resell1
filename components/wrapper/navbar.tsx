"use client"
import Link from 'next/link';
import * as React from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { Button } from "../ui/button";
import { SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { UserProfile } from "../user-profile";
import ModeToggle from "../mode-toggle";
import { BlocksIcon } from "lucide-react";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import config from "@/config";
import { cn } from "@/lib/utils";
import { useAuth, SignInButton } from "@clerk/nextjs";
import { Dialog, DialogClose } from "@radix-ui/react-dialog";

const Logo = ({
  textSize = 'text-xl',
  roundness = 'rounded-lg',
}) => {
  return (
    <div
      className={`flex items-center justify-center w-auto bg-gray-200 dark:bg-gray-800 ${roundness} pl-2 pr-1 py-1`}>
      <span
        className={`${textSize} font-bold text-gray-100 bg-gray-900 dark:bg-white dark:text-gray-900 rounded pl-1 pr-[2px] tracking-widest`}>
        IP
      </span>
      <span className={`${textSize} font-bold text-gray-800 dark:text-gray-200 pl-[2px]`}>
        den
      </span>
    </div>
  );
};

const components: { title: string; href: string; description: string }[] = [
    {
        title: "Free Proxy List",
        href: "/free-proxies",
        description: "Access our updated list of free proxies from around the world"
    },
    {
        title: "IP Checker",
        href: "/ip-checker",
        description: "Check any IP address for location, provider, and proxy detection"
    },
];

const products: { title: string; href: string; description: string }[] = [
    {
        title: "Residential Proxies",
        href: "/products/residential-proxies",
        description: "Premium residential IPs from 195+ countries with 99.9% uptime"
    },
];

export default function NavBar() {
    let userId = null;
    /* eslint-disable react-hooks/rules-of-hooks */
    if (config?.auth?.enabled) {
        const user = useAuth();
        userId = user?.userId;
    }

    return (
        <div className="flex min-w-full fixed justify-between p-2 border-b z-10 dark:bg-black dark:bg-opacity-50 bg-white backdrop-blur-lg">
            <div className="flex justify-between w-full min-[825px]:hidden">
                <Dialog>
                    <SheetTrigger className="p-2 transition">
                        <Button size="icon" variant="ghost" className="w-4 h-4" aria-label="Open menu" asChild>
                            <GiHamburgerMenu />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left">
                        <SheetHeader>
                            <SheetTitle>Next Starter</SheetTitle>
                        </SheetHeader>
                        <div className="flex flex-col space-y-3 mt-[1rem]">
                            <DialogClose asChild>
                                <Link href="/">
                                    <Button variant="outline" className="w-full">Home</Button>
                                </Link>
                            </DialogClose>
                            <DialogClose asChild>
                                <Link href="/dashboard" legacyBehavior passHref className="cursor-pointer">
                                    <Button variant="outline">
                                        Dashboard
                                    </Button>
                                </Link>
                            </DialogClose>
                        </div>
                    </SheetContent>
                </Dialog>
                <ModeToggle />
            </div>
            <NavigationMenu>
                <NavigationMenuList className="max-[825px]:hidden flex gap-3 w-[100%] justify-between">
                    <Link href="/" className="pl-2 flex items-center gap-2" aria-label="Home">
                        <Logo textSize="text-lg" roundness="rounded-md" />
                    </Link>
                </NavigationMenuList>
                <NavigationMenuList>
                    <NavigationMenuItem className="max-[825px]:hidden ml-5">
                        <NavigationMenuTrigger className="dark:bg-black dark:bg-opacity-50">
                            Products
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <ul className="flex flex-col w-[400px] gap-3 p-4 lg:w-[500px]">
                                {products.map((product, index) => (
                                    <ListItem
                                        key={index}
                                        title={product.title}
                                        href={product.href}>
                                        {product.description}
                                    </ListItem>
                                ))}
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                    <NavigationMenuItem className="max-[825px]:hidden ml-5">
                        <NavigationMenuTrigger className="dark:bg-black dark:bg-opacity-50">
                            Features
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <ul className="flex flex-col w-[400px] gap-3 p-4 lg:w-[500px]">
                                {components.map((component, index) => (
                                    <ListItem
                                        key={index}
                                        title={component.title}
                                        href={component.href}>
                                        {component.description}
                                    </ListItem>
                                ))}
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                    <NavigationMenuItem className="max-[825px]:hidden">
                        <Link href="/#pricing" legacyBehavior passHref>
                            <Button variant="ghost">
                                Pricing
                            </Button>
                        </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem className="max-[825px]:hidden">
                        <Link href="/dashboard" legacyBehavior passHref>
                            <Button variant="ghost">
                                Dashboard
                            </Button>
                        </Link>
                    </NavigationMenuItem>
                     <NavigationMenuItem className="max-[825px]:hidden">
                        <Link href="/documentation" legacyBehavior passHref>
                            <Button variant="ghost">
                                Docs
                            </Button>
                        </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem className="max-[825px]:hidden">
                        <Link href="/contact-sales" legacyBehavior passHref>
                            <Button variant="ghost">
                                Contact Sales
                            </Button>
                        </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem className="max-[825px]:hidden">
                        <Link href="/partners" legacyBehavior passHref>
                            <Button variant="ghost">
                                Partners
                            </Button>
                        </Link>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
            <div className="flex items-center gap-2 max-[825px]:hidden">
                {userId ? (
                    <UserProfile />
                ) : (
                    <SignInButton mode="modal">
                        <Button variant="default" size="sm">
                            Sign In
                        </Button>
                    </SignInButton>
                )}
                <ModeToggle />
            </div>
        </div>
    );
}

const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    ref={ref}
                    className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        className
                    )}
                    {...props}
                >
                    <div className="text-sm font-medium leading-none">{title}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                </a>
            </NavigationMenuLink>
        </li>
    );
});
ListItem.displayName = "ListItem";
