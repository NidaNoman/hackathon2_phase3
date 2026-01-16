'use client'; // This is a client component

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/state/authContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Alert, AlertDescription } from '@/components/ui/Alert'; // Import Alert

export default function SignUpPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth(); // Access the login function from AuthContext

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null); // Clear previous errors
    setLoading(true);

    try {
      const response = await api.post<{ message: string; user_id: number; access_token?: string }>(
        '/api/v1/auth/register', // Corrected API path
        { username, password }
      );
      
      // Assuming successful registration also logs the user in and returns a token
      if (response.access_token) {
        login(response.access_token);
        router.push('/tasks'); // Redirect to tasks page after successful signup and login
      } else {
        // If no token is returned, just redirect to login
        router.push('/login');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign up. Please try again.');
    } finally {
      setLoading(false);
    }
  };

    return (
      <div className="flex min-h-screen items-center justify-center py-12">
              <Card>
                <CardHeader className="text-center">
                  <CardTitle className="text-3xl font-bold">TaskFlow</CardTitle>
                  <CardDescription>Create your account</CardDescription>
                </CardHeader>
                <CardContent>            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Choose a username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
  
              {error && (
                <Alert variant="destructive">
                  <AlertDescription className="text-center">{error}</AlertDescription>
                </Alert>
              )}
  
              <Button type="submit" className="w-full text-base" disabled={loading}>
                {loading ? 'Signing up...' : 'Sign up'}
              </Button>
            </form>
            <div className="mt-6 text-center text-base text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="underline underline-offset-4 hover:text-primary">
                Log in
              </Link>
            </div>
                  </CardContent>
                </Card>      </div>
    );}
