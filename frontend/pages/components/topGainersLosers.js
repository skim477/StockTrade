import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Button, Tabs, Tab, ListGroup, Pagination } from 'react-bootstrap';
import { getToken } from '@/lib/authenticate';

const TopGainersLosers = () => {

    const [data, setData] = useState({
        top_gainers: [],
        top_losers: [],
        most_actively_traded: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    //Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        const fetchData = async () => {
            console.log('Fetching data...');
            setLoading(true);

            try {
                // const response = await axios.get(ALPHA_URL);

                const token = getToken(); // Get JWT token
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/top-gainers-losers`, {
                    headers: {
                        Authorization: `JWT ${token}`
                    }
                });
                setData({
                    top_gainers: response.data.top_gainers || [],
                    top_losers: response.data.top_losers || [],
                    most_actively_traded: response.data.most_actively_traded || [],
                });
            } catch (error) {
                console.error(error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    
    const currentGainers = data.top_gainers.length ? data.top_gainers.slice(indexOfFirstItem, indexOfLastItem) : [];
    const currentLosers = data.top_losers.length ? data.top_losers.slice(indexOfFirstItem, indexOfLastItem) : [];
    const currentMostActive = data.most_actively_traded.length ? data.most_actively_traded.slice(indexOfFirstItem, indexOfLastItem) : [];

    const totalPages = Math.ceil(data.top_gainers.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };


    if (loading) return <p>Loading...</p>
    if (error) return <p>Error: {error}</p>

    return (
        <Container>
            <Tabs
                defaultActiveKey="top_gainers"
                id="uncontrolled-tab"
                className="mb-3 flex-wrap"
            >
                <Tab eventKey="top_gainers" title="Top Gainers">
                    <ListGroup>
                        {currentGainers.map((stock, index) => (
                            <ListGroup.Item key={index} className="d-flex justify-content-between">
                            <div>
                                <div><strong>{stock.ticker}</strong></div>
                                {/* <div>{stock.name}</div> */}
                            </div>

                            <div>
                                <div>${stock.price}</div>
                                <div style={{ color: 'green', fontSize: '0.8em' }}>
                                    + {stock.change_amount}
                                </div>
                            </div>
                            </ListGroup.Item> 
                        ))}
                    </ListGroup>
                </Tab>
                <Tab eventKey="top_losers" title="Top Losers">
                    <ListGroup>
                        {currentLosers.map((stock, index) => (
                            <ListGroup.Item key={index} className="d-flex justify-content-between">
                            <div>
                                <div><strong>{stock.ticker}</strong></div>
                                {/* <div>{stock.name}</div> */}
                            </div>

                            <div>
                                <div>${stock.price}</div>
                                <div style={{ color: 'red', fontSize: '0.8em' }}>
                                    {stock.change_amount}
                                </div>
                            </div>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Tab>
                <Tab eventKey="most_actively_traded" title="Most Active">
                    <ListGroup>
                        {currentMostActive.map((stock, index) => (
                            <ListGroup.Item key={index} className="d-flex justify-content-between">
                            <div>
                                <div><strong>{stock.ticker}</strong></div>
                                {/* <div>{stock.name}</div> */}
                            </div>

                            <div>
                                <div>${stock.price}</div>
                                <div style={{ 
                                    color: stock.change_amount > 0 ? 'green' : 'red', 
                                    fontSize: '0.8em',
                                }}>
                                    ${stock.change_amount}
                                </div>
                            </div>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Tab>
            </Tabs>
            {/* Pagination controls */}
            <Pagination>
                {[...Array(totalPages).keys()].map((pageNumber) => (
                    <Pagination.Item
                        key={pageNumber + 1}
                        active={pageNumber + 1 === currentPage}
                        onClick={() => handlePageChange(pageNumber + 1)}
                    >
                        {pageNumber + 1}
                    </Pagination.Item>
                ))}
            </Pagination>
        </Container>
    )


};

export default TopGainersLosers;