'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  Zap, 
  CheckCircle2, 
  Loader2,
  Gift,
  BarChart3 
} from 'lucide-react';
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

export default function PartnersPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    website: '',
    monthly_traffic: '',
    audience: '',
    promotion_method: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast.success('Application submitted! We will review and contact you within 2-3 business days.');
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
          <h1 className="text-4xl font-bold mb-4">Application Received!</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Thank you for applying to our Partner Program. Our team will review your application and get back to you within 2-3 business days.
          </p>
          <Button onClick={() => window.location.href = '/'}>
            Return to Homepage
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Hero Section */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Logo textSize="text-4xl" roundness="rounded-xl" />
          </div>
          <Badge className="mb-4 bg-blue-600 text-white px-4 py-2">
            Affiliate & Partner Program
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Earn Up to 30% Commission
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8">
            Join our partner program and earn generous commissions by promoting the world's best residential proxy service
          </p>
        </div>
      </section>

      {/* Commission Tiers */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Commission Structure
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 border-gray-200 dark:border-gray-700">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-center mb-2">Starter</h3>
                <div className="text-4xl font-bold text-blue-600 text-center mb-4">15%</div>
                <p className="text-center text-gray-600 dark:text-gray-400 mb-4">
                  0-10 referrals per month
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span>30-day cookie duration</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span>Marketing materials</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span>Monthly payouts</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-600 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-600 text-white">Most Popular</Badge>
              </div>
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-center mb-2">Professional</h3>
                <div className="text-4xl font-bold text-blue-600 text-center mb-4">20%</div>
                <p className="text-center text-gray-600 dark:text-gray-400 mb-4">
                  11-50 referrals per month
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span>60-day cookie duration</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span>Premium marketing materials</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span>Bi-weekly payouts</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span>Dedicated support</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-200 dark:border-gray-700">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-center mb-2">Elite</h3>
                <div className="text-4xl font-bold text-blue-600 text-center mb-4">30%</div>
                <p className="text-center text-gray-600 dark:text-gray-400 mb-4">
                  50+ referrals per month
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span>90-day cookie duration</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span>Custom marketing materials</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span>Weekly payouts</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span>Priority support</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span>Exclusive bonuses</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why Partner With Us?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">High Commissions</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Earn up to 30% recurring commissions on all referrals
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Real-Time Tracking</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Monitor clicks, conversions, and earnings in real-time
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Gift className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Marketing Assets</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Access to banners, landing pages, and promotional content
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Dedicated Support</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Personal affiliate manager to help you succeed
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Apply to Become a Partner
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Fill out the form below and we'll review your application within 2-3 business days
            </p>
          </div>

          <Card>
            <CardContent className="pt-6">
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
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Company/Brand Name
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
                      Website/Social Media <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      placeholder="https://example.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Expected Monthly Traffic <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="monthly_traffic"
                      value={formData.monthly_traffic}
                      onChange={handleChange}
                      required
                      className="w-full h-10 px-3 rounded-md border border-input bg-background">
                      <option value="">Select range</option>
                      <option value="0-1k">0-1,000</option>
                      <option value="1k-10k">1,000-10,000</option>
                      <option value="10k-50k">10,000-50,000</option>
                      <option value="50k+">50,000+</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Target Audience <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="audience"
                      value={formData.audience}
                      onChange={handleChange}
                      required
                      className="w-full h-10 px-3 rounded-md border border-input bg-background">
                      <option value="">Select audience</option>
                      <option value="developers">Developers</option>
                      <option value="marketers">Digital Marketers</option>
                      <option value="businesses">Businesses</option>
                      <option value="researchers">Researchers</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    How will you promote IPden? <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="promotion_method"
                    value={formData.promotion_method}
                    onChange={handleChange}
                    required
                    className="w-full h-10 px-3 rounded-md border border-input bg-background">
                    <option value="">Select method</option>
                    <option value="blog">Blog/Content Marketing</option>
                    <option value="social">Social Media</option>
                    <option value="youtube">YouTube/Video</option>
                    <option value="email">Email Marketing</option>
                    <option value="paid">Paid Advertising</option>
                    <option value="community">Community/Forum</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Tell us about yourself and your promotion strategy
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Share your experience, audience, and how you plan to promote IPden..."
                    rows={5}
                    className="w-full px-3 py-2 rounded-md border border-input bg-background resize-none"
                  />
                </div>

                <Button type="submit" size="lg" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Application'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How do I get paid?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  We offer multiple payment methods including PayPal, bank transfer, and cryptocurrency. Payments are processed according to your tier (monthly, bi-weekly, or weekly).
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What is the minimum payout?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  The minimum payout threshold is $100. Once you reach this amount, you can request a payout.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How long does the cookie last?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  Cookie duration ranges from 30 to 90 days depending on your tier. This means you'll earn commission on any purchase made within that timeframe after a user clicks your referral link.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Do you provide marketing materials?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  Yes! We provide banners, landing pages, email templates, and promotional content. Elite partners get access to custom materials tailored to their audience.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
