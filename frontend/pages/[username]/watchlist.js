import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Container, Row, Col, Card, Button, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { getToken } from '@/lib/authenticate';
import { useAtom } from 'jotai';
import { favouritesAtom } from '@/lib/store'; // Import the Jotai atom
import dynamic from 'next/dynamic';

// Dynamically import SingleTicker, disabling SSR
const SingleTicker = dynamic(() => import('react-ts-tradingview-widgets').then((mod) => mod.SingleTicker), { ssr: false });

const Watchlist = () => {
    const router = useRouter();
    const { username } = router.query;
    const [favourites, setFavourites] = useAtom(favouritesAtom); // Use Jotai atom
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFavourites = async () => {
            try {
                const token = getToken();
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/favourites`, {
                    headers: {
                        Authorization: `JWT ${token}`,
                    },
                });
                setFavourites(response.data.favourites);
            } catch (error) {
                setError(error.message);
                console.error('Error fetching favourites:', error.message);
            } finally {
                setLoading(false);
            }
        };

        if (username) {
            fetchFavourites();
        }
    }, [username, setFavourites]);


    const handleRemoveFavourite = async (ticker) => {
        try {
            const token = getToken();
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/favourites/${ticker}`, {
                headers: {
                    Authorization: `JWT ${token}`,
                },
            });
            // Remove the ticker from the favorites list
            setFavourites(favourites.filter((fav) => fav !== ticker));
        } catch (error) {
            setError(error.message);
            console.error('Error removing favourite:', error.message);
        }
    };

    const navigateToTicker = (ticker) => {
        if (username) {
            router.push(`/${username}/${ticker}`);
        }
    };

    if (loading) return <Spinner animation="border" role="status"/>;
    if (error) return <Alert variant="danger">{error}</Alert>;

    return (
        <Container fluid="md">
            <Row className="mt-3 mb-3">
                <h2>{username}'s Watchlist</h2>
            </Row>
            <Row>
                {favourites.length > 0 ? (
                    favourites.map((ticker, index) => (
                        <Col key={index} xs={12} md={4} lg={3} className="mb-3">
                            <Card>
                                <Card.Body>
                                    <Card.Title onClick={() => navigateToTicker(ticker)} style={{ cursor: 'pointer' }}>
                                        {ticker.toUpperCase()}
                                    </Card.Title>
                                    <Card.Text>
                                        <SingleTicker width="100%" symbol={ticker} />
                                    </Card.Text>
                                    <Button variant="primary" size="sm" className="me-1" onClick={() => navigateToTicker(ticker)}>
                                        More
                                    </Button>
                                    <Button variant="danger" size="sm" onClick={() => handleRemoveFavourite(ticker)}>
                                        Remove
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                ) : (
                    <Alert variant="info">No watchlist stocks found.</Alert>
                )}
            </Row>
        </Container>
    );
};

export default Watchlist;