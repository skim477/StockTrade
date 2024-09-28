import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Container, Button, Card, Form, Alert } from 'react-bootstrap';

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [warning, setWarning] = useState('');

    const router = useRouter();

    const handleClick = async (e) => {
        e.preventDefault();

        if (password != password2) {
            setWarning("Passwords do not match")
            return;
        }

        try {
            const res = await fetch('http://localhost:8080/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
          });
            const data = await res.json();
            if (res.status === 201) {
                alert('User created successfully');
                router.push('/login');
            } else {
                setWarning(data.message);
            }
        } catch (error) {
          console.error('Error:', error);
        }
    };


    return (
        <Container fluid="md" className="mt-5">
            <h2 style={{ color: '#78C2AD' }} className="text-center  mb-3">StockTrade</h2>
            <Card style={{backgroundColor: '#78C2AD', color: 'white', width: '60%', margin: 'auto', padding: '3rem'}}>
                <Card.Header>
                    <Card.Title style={{ color: 'white' }}>Create an Account</Card.Title>
                </Card.Header>
                <Card.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" value={email} name="email" id="email" onChange={e=> setEmail(e.target.value)} placeholder="xxx@example.com" />
                            <Form.Text className="text-muted">
                                We'll never share your personal information.
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" value={password} name="password" id="password" onChange={e=> setPassword(e.target.value)} placeholder="Password" />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control type="password" value={password2} name="password2" id="password2" onChange={e=> setPassword2(e.target.value)} placeholder="Confirm Password" />
                        </Form.Group>
                        {warning && 
                        <Alert variant='danger'>
                            {warning}
                        </Alert>
                        }

                        <div className="d-flex justify-content-center">
                            <Button variant="info" className="m-3 w-75" onClick={handleClick }>
                                Sign Up
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );

};

export default SignUp;