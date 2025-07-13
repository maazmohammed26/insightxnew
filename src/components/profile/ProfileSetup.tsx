
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { User, Mail, ArrowRight, Github, Linkedin, Twitter, CheckCircle2 } from 'lucide-react';

interface ProfileData {
  name: string;
  email: string;
  id: string;
  friends: any[];
  dateCreated: string;
  socialLinks?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
}

const ProfileSetup = ({ onComplete }: { onComplete: () => void }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [socialLinks, setSocialLinks] = useState({
    github: '',
    linkedin: '',
    twitter: ''
  });
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Try to load saved form data
    const savedFormData = localStorage.getItem('profileSetupForm');
    if (savedFormData) {
      const { name, email, socialLinks } = JSON.parse(savedFormData);
      setName(name);
      setEmail(email);
      setSocialLinks(socialLinks);
    }
  }, []);

  const saveFormData = () => {
    localStorage.setItem('profileSetupForm', JSON.stringify({
      name,
      email,
      socialLinks
    }));
  };

  // Save form data whenever it changes
  useEffect(() => {
    saveFormData();
  }, [name, email, socialLinks]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (!name.trim() || !email.trim()) {
        toast.error('Please fill in all required fields');
        return;
      }

      if (!email.includes('@')) {
        toast.error('Please enter a valid email address');
        return;
      }

      const profileData: ProfileData = {
        name: name.trim(),
        email: email.trim(),
        id: `${name.toLowerCase().replace(/\s+/g, '-')}-${Math.random().toString(36).substring(7)}`,
        friends: [],
        dateCreated: new Date().toISOString(),
        socialLinks: {
          ...(socialLinks.github && { github: socialLinks.github }),
          ...(socialLinks.linkedin && { linkedin: socialLinks.linkedin }),
          ...(socialLinks.twitter && { twitter: socialLinks.twitter })
        }
      };

      localStorage.setItem('userProfile', JSON.stringify(profileData));
      // Clear form data after successful submission
      localStorage.removeItem('profileSetupForm');
      toast.success('Profile created successfully!');
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      onComplete();
    } catch (error) {
      toast.error('Error creating profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <img
          src="/lovable-uploads/b0078076-6a7e-4146-92e2-e132f369019e.png"
          alt="InsightX Logo"
          className="w-32 h-32 object-contain filter drop-shadow-xl"
        />
      </motion.div>

      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"
          >
            Welcome to InsightX
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-500 dark:text-gray-400"
          >
            Let's set up your profile
          </motion.p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <Button type="button" onClick={() => setStep(2)} className="w-full">
                    Next <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="github">GitHub Profile</Label>
                    <div className="relative">
                      <Github className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="github"
                        type="text"
                        placeholder="Your GitHub username"
                        value={socialLinks.github}
                        onChange={(e) => setSocialLinks(prev => ({ ...prev, github: e.target.value }))}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn Profile</Label>
                    <div className="relative">
                      <Linkedin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="linkedin"
                        type="text"
                        placeholder="Your LinkedIn username"
                        value={socialLinks.linkedin}
                        onChange={(e) => setSocialLinks(prev => ({ ...prev, linkedin: e.target.value }))}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="twitter">Twitter Profile</Label>
                    <div className="relative">
                      <Twitter className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="twitter"
                        type="text"
                        placeholder="Your Twitter username"
                        value={socialLinks.twitter}
                        onChange={(e) => setSocialLinks(prev => ({ ...prev, twitter: e.target.value }))}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={() => setStep(1)} className="w-1/2">
                      Back
                    </Button>
                    <Button 
                      type="submit" 
                      className="w-1/2"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="mr-2"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </motion.div>
                          Setting up...
                        </span>
                      ) : (
                        'Complete Setup'
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>

          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} InsightX. All rights reserved.
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Developed with ❤️ for Data Enthusiasts
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Version 3.0.0 | Advanced CSV Analysis Tool
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSetup;
