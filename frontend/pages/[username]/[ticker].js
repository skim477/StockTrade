import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Container, Row, Alert, Button } from 'react-bootstrap';
import TradingViewChart from '../components/tradingviewChart';
import Dividends from '../components/dividends';
import News from '../components/news';
import { getToken } from '@/lib/authenticate';
import axios from 'axios';
import { useAtom } from 'jotai';
import { favouritesAtom } from '@/lib/store'; // Import the atom

const Ticker = () => {
    const router = useRouter();
    const { ticker } = router.query;
    const [favourites, setFavourites] = useAtom(favouritesAtom); // Use Jotai atom
    const [error, setError] = useState(null);

    const symbol = ticker ? ticker.toUpperCase() : '';

    useEffect(() => {
        if (symbol) {
            const checkFavouriteStatus = async () => {
                try {
                    const token = getToken();
                    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/favourites/${symbol}`, {
                        headers: {
                            Authorization: `JWT ${token}`,
                        },
                    });
                    if (response.data.isFavourite) {
                        setFavourites((prev) => [...prev, symbol]); // Add to Jotai atom state
                    }
                } catch (error) {
                    console.error(error);
                    setError(error.message);
                }
            };
        checkFavouriteStatus();
        }
    }, [symbol, setFavourites]);

    const handleFavouriteToggle = async () => {
        try {
            const token = getToken();
            if (favourites.includes(symbol)) {
                await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/favourites/${symbol}`, {
                    headers: {
                        Authorization: `JWT ${token}`,
                    },
                });
                setFavourites((prev) => prev.filter((fav) => fav !== symbol)); // Remove from Jotai atom state
            } else {
                await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/favourites`, { symbol }, {
                    headers: {
                        Authorization: `JWT ${token}`,
                    },
                });
                setFavourites((prev) => [...prev, symbol]); // Add to Jotai atom state
            }
        } catch (error) {
            console.error('Error toggling favourite status:', error);
            setError(error.message);
        }
    };

    if (!ticker) {
        return <p>Loading...</p>;
    }

    return (
        <Container fluid="md">
            <Row className='mt-3 mb-3'>
                <h3>{symbol}</h3>
                <Button variant={favourites.includes(symbol) ? 'danger' : 'success'} onClick={handleFavouriteToggle}>
                    {favourites.includes(symbol) ? 'Remove from watchlist' : 'Add to watchlist'}
                </Button>
            </Row>
            {error && (
                <Alert variant="danger" className="mt-3">
                    {error}
                </Alert>
            )}
            <Row className='mb-4'>
                <TradingViewChart symbol={symbol} />
            </Row>
            <Row className='mb-4'>
                <Dividends ticker={symbol} />
            </Row>
            <Row>
                <News ticker={symbol} />
            </Row>
        </Container>
    );
};

export default Ticker;