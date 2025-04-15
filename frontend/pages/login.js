import React, { useState } from 'react';
import { setToken } from '@/lib/authenticate';
import { useRouter } from 'next/router';
import { Container, Button, Card, Form, Alert } from 'react-bootstrap';

const Login = () => {

    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [warning, setWarning] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch('${process.env.NEXT_PUBLIC_API_URL}/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (res.status === 200) {
                // Store token in local storage
                setToken(data.token);
                console.log("login successful");
                
                const username = email.split('@')[0];
                router.push(`/${username}/main`);
            } else {
                setWarning(data.message);
            }
        } catch (error) {
            console.error('Error:', error);
            setWarning('An error occurred');
        }
    };

    const handleCreateAccountClick = () => {
        router.push('/signup');
    };

    return (
        <Container fluid="md" className="mt-5">
            <h2 style={{ color: '#78C2AD' }} className="text-center mb-3">StockTrade</h2>
            <Card style={{backgroundColor: '#78C2AD', color: 'white', width: '60%', margin: 'auto', padding: '3rem'}}>
                <Card.Header>
                    <Card.Title style={{ color: 'white' }}>Account</Card.Title>
                </Card.Header>
                <Card.Body>
                    {warning && <Alert variant="danger">{warning}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" placeholder="xxx@example.com" value={email} name="email" id="email" onChange={e=> setEmail(e.target.value)}/>
                            <Form.Text className="text-muted">
                                We'll never share your personal information.
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" value={password} name="password" id="password" onChange={e=> setPassword(e.target.value)}/>
                        </Form.Group>

                        <div className="d-flex justify-content-center">
                            <Button variant="info" type="submit" className="m-3 w-75">
                                Login
                            </Button>
                        </div>
                        <div className="d-flex justify-content-center">
                            <Button variant="info" className="mb-3 w-75" onClick={handleCreateAccountClick }>
                                Create an Account
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );

};

export default Login;