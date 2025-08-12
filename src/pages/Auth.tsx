import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/components/auth/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type AuthMode = 'signin' | 'signup' | 'verify-phone';

export default function Auth() {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState<boolean>(() => {
    try {
      const v = localStorage.getItem('rememberMe');
      return v ? JSON.parse(v) : true;
    } catch {
      return true;
    }
  });
  const { signIn, signUp, verifyPhone, sendPhoneVerification, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  React.useEffect(() => {
    localStorage.setItem('rememberMe', JSON.stringify(rememberMe));
  }, [rememberMe]);

  React.useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'signin') {
        const { error } = await signIn(email, password);
        if (!error) {
          navigate('/dashboard');
        }
      } else if (mode === 'signup') {
        const { error } = await signUp(email, password, phone);
        if (!error && phone) {
          await sendPhoneVerification(phone);
          setMode('verify-phone');
        }
      } else if (mode === 'verify-phone') {
        const { error } = await verifyPhone(phone, verificationCode);
        if (!error) {
          navigate('/dashboard');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0
    })
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="bg-card/90 backdrop-blur-lg border-border/50 shadow-elegant">
          <CardHeader className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="mx-auto w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mb-4"
            >
              {mode === 'signin' ? <LogIn className="h-6 w-6 text-white" /> :
               mode === 'signup' ? <UserPlus className="h-6 w-6 text-white" /> :
               <Phone className="h-6 w-6 text-white" />}
            </motion.div>
            <CardTitle className="text-2xl bg-gradient-primary bg-clip-text text-transparent">
              Daily Progress Tracker
            </CardTitle>
            <CardDescription>
              {mode === 'signin' && 'Welcome back! Sign in to continue your journey'}
              {mode === 'signup' && 'Create your account and start tracking your progress'}
              {mode === 'verify-phone' && 'Verify your phone number to complete setup'}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <AnimatePresence mode="wait">
              <motion.form
                key={mode}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "tween", duration: 0.3 }}
                onSubmit={handleSubmit}
                className="space-y-4"
                itemScope
                itemType="https://schema.org/LoginAction"
              >
                {mode !== 'verify-phone' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="hatom-field"
                        itemProp="email"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="hatom-field"
                      />
                    </div>

                    {mode === 'signin' && (
                      <div className="flex items-center justify-between">
                        <label htmlFor="remember" className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                          <Checkbox
                            id="remember"
                            checked={rememberMe}
                            onCheckedChange={(v) => setRememberMe(Boolean(v))}
                          />
                          Remember me
                        </label>
                        <span className="text-xs text-muted-foreground">Keeps you signed in</span>
                      </div>
                    )}

                  </>
                )}

                {mode === 'signup' && (
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number (Optional)</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1234567890"
                      className="hatom-field"
                      itemProp="telephone"
                    />
                  </div>
                )}

                {mode === 'verify-phone' && (
                  <div className="space-y-2">
                    <Label htmlFor="code">Verification Code</Label>
                    <Input
                      id="code"
                      type="text"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      placeholder="Enter 6-digit code"
                      maxLength={6}
                      required
                      className="hatom-field text-center text-lg tracking-widest"
                    />
                  </div>
                )}

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
                  >
                    {loading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      <>
                        {mode === 'signin' && 'Sign In'}
                        {mode === 'signup' && 'Create Account'}
                        {mode === 'verify-phone' && 'Verify Phone'}
                      </>
                    )}
                  </Button>
                </motion.div>

                {mode !== 'verify-phone' && (
                  <div className="text-center text-sm">
                    {mode === 'signin' ? (
                      <>
                        Don't have an account?{' '}
                        <button
                          type="button"
                          onClick={() => setMode('signup')}
                          className="text-primary hover:underline font-medium"
                        >
                          Sign up
                        </button>
                      </>
                    ) : (
                      <>
                        Already have an account?{' '}
                        <button
                          type="button"
                          onClick={() => setMode('signin')}
                          className="text-primary hover:underline font-medium"
                        >
                          Sign in
                        </button>
                      </>
                    )}
                  </div>
                )}

                {mode === 'verify-phone' && (
                  <div className="text-center text-sm">
                    <button
                      type="button"
                      onClick={() => sendPhoneVerification(phone)}
                      disabled={loading}
                      className="text-primary hover:underline font-medium"
                    >
                      Resend code
                    </button>
                  </div>
                )}
              </motion.form>
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}