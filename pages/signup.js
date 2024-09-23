import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Container, Button, Card, Form } from 'react-bootstrap';

const Login = () => {

    const router = useRouter();

    const handleClick = () => {
        router.push('/');
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
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" placeholder="xxx@example.com" />
                            <Form.Text className="text-muted">
                                We'll never share your personal information.
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control type="password" placeholder="Confirm Password" />
                        </Form.Group>

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

export default Login;