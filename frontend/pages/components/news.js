import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Button, Tabs, Tab, ListGroup, Card, Row, Col, Pagination } from 'react-bootstrap';
import styles from '@/styles/News.module.css';

const POLYGON_API_KEY = 'H8pwcjAJyG8SbWTtN_HFmaVvNznEsHgc';
const POLYGON_URL = `https://api.polygon.io/v2/reference/news?limit=12&apiKey=${POLYGON_API_KEY}`;

const News = () => {
    const [newsData, setNewsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    //Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;

    
    useEffect(()=> {
        const fetchNewsData = async () => {
            setLoading(true);
            try{
                const response = await axios.get(POLYGON_URL);        
                setNewsData(response.data.results);
            } catch(error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        
        }
        fetchNewsData();
    }, []);

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        
    const currentNews = newsData.length ? newsData.slice(indexOfFirstItem, indexOfLastItem): [];
        
    const totalPages = Math.ceil(newsData.length / itemsPerPage);
    
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };


    if (loading) return <p>Loading...</p>
    if (error) return <p>Error: {error}</p>

    return (
        <Container className={styles.newsContainer}>
            <Row>
                <h3>Top News</h3>
                {currentNews.map((news, index)=>(
                    <Col key={index} className="mb-4">
                    <Card style={{ width: '18rem' }}>
                        <Card.Img className={styles.newsCardImg} variant="top" src={news.image_url} alt={news.title}/>
                        <Card.Body>
                            <Card.Title style={{fontSize:'1.0rem'}}>{news.title}</Card.Title>
                            <Card.Text style={{fontSize:'0.8rem'}}>{news.description}</Card.Text>
                            <a href={news.article_url} target="_blank" rel="noopener noreferrer" className="btn btn-primary">Read More</a>

                        </Card.Body>
                    </Card>
                    </Col>
                ))}
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
    );

};

export default News;