import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Pagination } from 'react-bootstrap';
import axios from 'axios';
import { getToken } from '@/lib/authenticate';

const Dividends = ({ticker}) => {
    const [dividendsData, setDividendsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    //Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(()=> {
        const fetchDividends = async () => {
            setLoading(true);
            try {
                const token = getToken();
                const response = await axios.get(`http://localhost:8080/api/dividends/${ticker}`, {
                    headers: {
                      Authorization: `JWT ${token}`
                    }
                });
                setDividendsData(response.data.results);
            } catch (error) {
                setError(error.message);
                console.error(error);           
            } finally {
                setLoading(false);
            }
        }

        fetchDividends();
    },[ticker])

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
            
    const currentDividends = dividendsData.length ? dividendsData.slice(indexOfFirstItem, indexOfLastItem): [];
            
    const totalPages = Math.ceil(dividendsData.length / itemsPerPage);
        
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

        
    if (loading) return <p>Loading...</p>
    if (error) return <p>Error: {error}</p>

    return (
        <Container>
            <Row>
                <h3>Dividends History: {ticker}</h3>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Ex-Dividend Date</th>
                            <th>Type</th>
                            <th>Cash Amount</th>
                            <th>Declaration Date</th>
                            <th>Record Date</th>
                            <th>Payment Date</th>
                        </tr>
                    </thead>      
                    <tbody>                                  
                        {currentDividends.map((data, index)=> (
                        <tr key={index}>
                            <td>{data.ex_dividend_date}</td>
                            <td>{data.dividend_type}</td>
                            <td>{data.cash_amount}</td>
                            <td>{data.declaration_date}</td>
                            <td>{data.record_date}</td>
                            <td>{data.pay_date}</td>
                        </tr>
                        ))}     
                    </tbody>
                </Table>
            </Row>
            
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

export default Dividends;