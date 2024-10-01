import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { getToken } from '@/lib/authenticate';
import { useAtom } from 'jotai';
import { favouritesAtom } from '@/lib/store'; // Import the Jotai atom

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
                const response = await axios.get('http://localhost:8080/api/favourites', {
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
            await axios.delete(`http://localhost:8080/api/favourites/${ticker}`, {
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

    if (loading) return <p>Loading...</p>;
    if (error) return <Alert variant="danger">{error}</Alert>;

    return (
        <Container fluid="md">
            <Row className="mb-3">
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