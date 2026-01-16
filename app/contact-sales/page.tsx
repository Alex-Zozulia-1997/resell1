'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, MessageSquare, CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const Logo = ({ textSize = 'text-xl', roundness = 'rounded-lg' }) => {
  return (
    <div className={`flex items-center justify-center w-auto bg-gray-200 dark:bg-gray-800 ${roundness} pl-2 pr-1 py-1`}>
      <span className={`${textSize} font-bold text-gray-100 bg-gray-900 dark:bg-white dark:text-gray-900 rounded pl-1 pr-[2px] tracking-widest`}>
        IP
      </span>
      <span className={`${textSize} font-bold text-gray-800 dark:text-gray-200 pl-[2px]`}>
        den
      </span>
    </div>
  );
};

export default function ContactSales() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    traffic: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast.success('Thank you! We will contact you within 24 hours.');
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-white dark:bg-black py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4">Thank You!</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Your request has been received. Our sales team will contact you within 24 hours.
          </p>
          <Button onClick={() => window.location.href = '/'}>
            Return to Homepage
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <Logo textSize="text-3xl" roundness="rounded-lg" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Sales</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Need enterprise-grade proxy solutions? Our team is ready to help you scale.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Benefits */}
          <Card>
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Custom Solutions</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Tailored packages for your specific bandwidth and location needs
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                <Phone className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Dedicated Support</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Priority 24/7 support with a dedicated account manager
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Quick Response</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Get a response from our team within 24 hours
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Form */}
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Get in Touch</CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Fill out the form below and we'll get back to you soon
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@company.com"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Company Name
                  </label>
                  <Input
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Acme Corp"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Phone Number
                  </label>
                  <Input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Monthly Traffic Estimate <span className="text-red-500">*</span>
                </label>
                <select
                  name="traffic"
                  value={formData.traffic}
                  onChange={handleChange}
                  required
                  className="w-full h-10 px-3 rounded-md border border-input bg-background">
                  <option value="">Select traffic range</option>
                  <option value="1-5TB">1-5 TB</option>
                  <option value="5-10TB">5-10 TB</option>
                  <option value="10-50TB">10-50 TB</option>
                  <option value="50TB+">50+ TB</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your requirements..."
                  required
                  rows={5}
                  className="w-full px-3 py-2 rounded-md border border-input bg-background resize-none"
                />
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Submit Request'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Or reach us directly:
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <a href="mailto:sales@ipden.io" className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
              <Mail className="w-4 h-4" />
              sales@ipden.io
            </a>
            <a href="https://discord.gg/HUcHdrrDgY" target="_blank" className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
              <MessageSquare className="w-4 h-4" />
              Join our Discord
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
