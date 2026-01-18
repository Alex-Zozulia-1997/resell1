"use client"
import { Button } from '../ui/button';
import Link from 'next/link';
import { Mail, Github, Twitter, Linkedin } from 'lucide-react';

const Logo = () => {
  return (
    <div className="flex items-center justify-center w-auto bg-gray-200 dark:bg-gray-800 rounded-lg pl-2 pr-1 py-1">
      <span className="text-xl font-bold text-gray-100 bg-gray-900 dark:bg-white dark:text-gray-900 rounded pl-1 pr-[2px] tracking-widest">
        IP
      </span>
      <span className="text-xl font-bold text-gray-800 dark:text-gray-200 pl-[2px]">
        den
      </span>
    </div>
  );
};

export default function Footer() {
    return (
        <footer className="border-t dark:bg-black bg-gray-50 dark:bg-gray-950">
            <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
                    {/* Company Info */}
                    <div className="lg:col-span-1">
                        <Logo />
                        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 max-w-xs">
                            Premium residential proxy service with 195+ countries coverage and 99.9% uptime. Trusted by developers worldwide.
                        </p>
                        <div className="flex gap-3 mt-6">
                            <a href={process.env.NEXT_PUBLIC_DISCORD_URL || '#'} target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition">
                                <Github className="w-5 h-5" />
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition">
                                <Linkedin className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Products */}
                    <div>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">Products</p>
                        <ul className="mt-4 space-y-3 text-sm">
                            <li>
                                <Link href="/products/residential-proxies" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition">
                                    Residential Proxies
                                </Link>
                            </li>
                            <li>
                                <Link href="/#pricing" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition">
                                    Pricing Plans
                                </Link>
                            </li>
                            <li>
                                <Link href="/#add-traffic" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition">
                                    Buy Custom Amount
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Features & Tools */}
                    <div>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">Features & Tools</p>
                        <ul className="mt-4 space-y-3 text-sm">
                            <li>
                                <Link href="/free-proxies" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition">
                                    Free Proxy List
                                </Link>
                            </li>
                            <li>
                                <Link href="/ip-checker" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition">
                                    IP Checker Tool
                                </Link>
                            </li>
                            <li>
                                <Link href="/documentation" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition">
                                    Documentation
                                </Link>
                            </li>
                            <li>
                                <Link href="/dashboard/setup" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition">
                                    Code Examples
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Company & Support */}
                    <div>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">Company & Support</p>
                        <ul className="mt-4 space-y-3 text-sm">
                            <li>
                                <Link href="/dashboard" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition">
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link href="/partners" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition">
                                    Partner Program
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact-sales" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition">
                                    Contact Sales
                                </Link>
                            </li>
                            <li>
                                <Link href="/#faq" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition">
                                    FAQ
                                </Link>
                            </li>
                            <li>
                                <a href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'support@ipden.io'}`} className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition flex items-center gap-2">
                                    <Mail className="w-4 h-4" />
                                    Support
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex flex-wrap gap-6 text-xs text-gray-600 dark:text-gray-400">
                            <Link href="/terms" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
                                Terms & Conditions
                            </Link>
                            <Link href="/privacy" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
                                Privacy Policy
                            </Link>
                            <Link href="/refund-policy" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
                                Refund Policy
                            </Link>
                            <Link href="/acceptable-use" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
                                Acceptable Use
                            </Link>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                            &copy; {new Date().getFullYear()} IPden. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    )
}
