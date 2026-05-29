import React from 'react';
import founderPhoto from '../assets/SwapnilMenkar.png';

const About = () => {
    return (
        <div className="page-content about-page">
            <header className="page-header">
                <h1>About Us</h1>
                <p className="page-lead">
                    This e-commerce portal offers a modern online shopping experience with product browsing,
                    cart management, secure registration, and a responsive interface designed for smooth
                    checkout and order management on desktop, tablet, and mobile devices.
                </p>
            </header>

            <section className="content-section platform-section">
                <h2>Our E-Commerce Platform</h2>
                <p>
                    Swap Ecommerce Store delivers an end-to-end online retail experience, from product discovery
                    and cart management to user authentication and admin-ready architecture. The platform is
                    designed with scalability, performance, and clarity in mind for both shoppers and operators.
                </p>
                <div className="feature-grid">
                    <article className="feature-card">
                        <h3>Product Catalog</h3>
                        <p>Browse featured and detailed product listings with images, pricing, stock status, and descriptions.</p>
                    </article>
                    <article className="feature-card">
                        <h3>Secure Accounts</h3>
                        <p>Register, log in, and manage your profile with JWT-based authentication and role-aware access.</p>
                    </article>
                    <article className="feature-card">
                        <h3>Shopping Cart</h3>
                        <p>Add items to your cart with Redux-powered state so your selections persist as you shop.</p>
                    </article>
                    <article className="feature-card">
                        <h3>Responsive Design</h3>
                        <p>Shop comfortably on desktop, tablet, or mobile with a layout optimized for every screen size.</p>
                    </article>
                    <article className="feature-card">
                        <h3>Admin & Analytics</h3>
                        <p>Backend support for admin workflows, product management, orders, and business insights.</p>
                    </article>
                    <article className="feature-card">
                        <h3>Cloud-Ready Stack</h3>
                        <p>Built with React, Node.js, Express, MongoDB, and integrations suited for production deployment.</p>
                    </article>
                </div>
                <div className="tech-stack">
                    <h3>Technology Stack</h3>
                    <ul className="tag-list">
                        <li>React.js</li>
                        <li>Redux Toolkit</li>
                        <li>React Router</li>
                        <li>AG Grid</li>
                        <li>Node.js and Express</li>
                        <li>MongoDB</li>
                        <li>JWT Authentication</li>
                        <li>REST APIs</li>
                        <li>Responsive CSS</li>
                    </ul>
                </div>
            </section>

            <section className="content-section founder-section">
                <h2>Meet the Creator</h2>
                <div className="founder-profile">
                    <div className="founder-photo-wrap">
                        <img
                            src={founderPhoto}
                            alt="Swapnil Namdeo Menkar"
                            className="founder-photo"
                        />
                    </div>
                    <div className="founder-details">
                        <h3>Swapnil Namdeo Menkar</h3>
                        <p className="founder-role">Lead Technology Professional · Full-Stack Developer</p>
                        <p className="founder-location">Pune, Maharashtra, India</p>
                        <p>
                            Swapnil is a Lead Technology Professional with <strong>13.6+ years</strong> of experience
                            delivering scalable, high-performance web applications across banking, hospitality, media,
                            and enterprise domains. He specializes in modern UI architecture, enterprise data grids (AG Grid),
                            TypeScript/JavaScript, and Node.js, and applies Generative AI agents to improve delivery speed
                            and code quality while leading teams through Agile delivery, code reviews, and production support.
                        </p>
                        <p>
                            This e-commerce platform reflects his full-stack expertise, combining responsive front-end
                            design, RESTful APIs, secure authentication, and maintainable code structure for real-world
                            retail use cases.
                        </p>
                        <h4 className="founder-highlights-title">Full-Stack Highlights</h4>
                        <ul className="founder-highlights">
                            <li>Built this MERN e-commerce application with React.js, Redux Toolkit, React Router, HTML5, CSS3, Node.js, Express and MongoDB</li>
                            <li>Designed REST APIs for authentication, products, cart, orders, payments and admin workflows</li>
                            <li>Implemented JWT authentication, email OTP registration and role-based access control</li>
                            <li>Delivered responsive, component-driven UI with persistent cart state and client-side navigation</li>
                            <li>Hands-on experience with AG Grid for enterprise data tables, filtering, sorting and large dataset handling</li>
                            <li>Uses Generative AI agents (GitHub Copilot, Cursor, ChatGPT) for faster development, refactoring and defect resolution</li>
                            <li>13+ years building enterprise SPAs across banking, hospitality, media and retail sectors with TypeScript and JavaScript</li>
                            <li>Experienced in RxJS, NgRx, Bootstrap, SASS, micro-frontends, PostgreSQL, Azure and AWS</li>
                        </ul>
                        <div className="founder-contact">
                            <a href="mailto:swapnilmenkar@gmail.com">swapnilmenkar@gmail.com</a>
                            <span className="contact-sep">·</span>
                            <a href="tel:+918149005578">+91 8149005578</a>
                            <span className="contact-sep">·</span>
                            <a
                                href="https://www.linkedin.com/in/swapnil-menkar-7051852b/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                LinkedIn
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <section className="content-section">
                <h2>Professional Experience</h2>
                <ul className="timeline-list">
                    <li>
                        <strong>Synechron Technologies</strong> — Lead Technology (Sept 2023 to Jan 2026)
                        <span>Global banking sector · SPA delivery, mentoring, Agile delivery</span>
                    </li>
                    <li>
                        <strong>Hitachi Vantara</strong> — Senior Consultant 2 (Nov 2021 to Aug 2023)
                        <span>Energy and logistics SPAs · integrations, release readiness</span>
                    </li>
                    <li>
                        <strong>Cybage Software</strong> — System Analyst (July 2019 to Nov 2021)
                        <span>Travel and hospitality sector · media and booking projects</span>
                    </li>
                    <li>
                        <strong>Capgemini</strong> — Consultant (Oct 2018 to July 2019)
                        <span>International banking domain · SPA features and production support</span>
                    </li>
                    <li>
                        <strong>Xento Systems</strong> — Software Engineer (Aug 2014 to Oct 2018)
                        <span>Property management suite · front-end modules and PHP</span>
                    </li>
                    <li>
                        <strong>Aksha Softskills Pvt. Ltd.</strong> — Web Developer (Oct 2013 to Aug 2014)
                        <span>Nashik · uniforms and wears shop app · billing, branch management and RBAC</span>
                    </li>
                    <li>
                        <strong>Krishna Web Developers</strong> — Software Engineer (May 2012 to Oct 2013)
                        <span>Pune · quotation and BOQ management · education platform · Bootstrap and jQuery</span>
                    </li>
                </ul>
            </section>

            <section className="content-section">
                <h2>Core Technical Skills</h2>
                <div className="skills-grid">
                    <div>
                        <h4>Frontend</h4>
                        <ul className="tag-list">
                            <li>Angular (2+)</li>
                            <li>React.js</li>
                            <li>AG Grid</li>
                            <li>TypeScript / JavaScript</li>
                            <li>HTML5 / CSS3 / SASS</li>
                            <li>Angular Material</li>
                            <li>Bootstrap</li>
                        </ul>
                    </div>
                    <div>
                        <h4>Architecture and State</h4>
                        <ul className="tag-list">
                            <li>Micro-Frontends</li>
                            <li>Monorepo (Nx)</li>
                            <li>RxJS / NgRx</li>
                            <li>Responsive UI</li>
                            <li>WCAG Accessibility</li>
                        </ul>
                    </div>
                    <div>
                        <h4>Backend and Data</h4>
                        <ul className="tag-list">
                            <li>Node.js / Express.js</li>
                            <li>REST APIs</li>
                            <li>MongoDB</li>
                            <li>PostgreSQL / MySQL</li>
                            <li>PHP / RabbitMQ</li>
                        </ul>
                    </div>
                    <div>
                        <h4>Generative AI</h4>
                        <ul className="tag-list">
                            <li>Generative AI Agents</li>
                            <li>Prompt Engineering</li>
                            <li>GitHub Copilot</li>
                            <li>Cursor AI</li>
                            <li>ChatGPT / Codex</li>
                        </ul>
                    </div>
                    <div>
                        <h4>Tools and Cloud</h4>
                        <ul className="tag-list">
                            <li>Postman</li>
                            <li>CI/CD</li>
                            <li>Azure (AZ-900)</li>
                            <li>AWS</li>
                        </ul>
                    </div>
                </div>
            </section>

            <section className="content-section">
                <h2>Education & Certifications</h2>
                <ul className="info-list">
                    <li><strong>MCA</strong> — Savitribai Phule Pune University (2012)</li>
                    <li><strong>B.Com</strong> — Savitribai Phule Pune University (2009)</li>
                    <li><strong>AZ-900</strong> — Microsoft Azure Fundamentals (July 2023)</li>
                </ul>
                <p className="note-text">
                    Awards include Synechron Star Awards (2024) and Hitachi Vantara SPOT / Pinnacle Award (2023).
                </p>
            </section>

            <section className="content-section highlight-box recruiter-summary">
                <h2>Professional Summary</h2>
                <p>
                    Results-driven Lead Technology Professional specializing in scalable web applications,
                    enterprise UI development, and modern full-stack architecture. Proven track record across
                    banking, hospitality, media, and retail domains with strong Agile leadership, code quality
                    focus, and production support ownership.
                </p>
                <ul className="info-list recruiter-points">
                    <li><strong>13.6+ years</strong> of front-end and full-stack development experience</li>
                    <li>Led and mentored engineering teams through delivery, code reviews, and release cycles</li>
                    <li>Expert in enterprise data grids (AG Grid), SPA architecture, REST APIs, and cloud-ready systems</li>
                    <li>Active use of Generative AI agents to accelerate development, testing, and code quality</li>
                    <li>AZ-900 certified · Open to Lead / Senior Full-Stack and Front-End Lead opportunities</li>
                </ul>
                <div className="recruiter-contact">
                    <a href="mailto:swapnilmenkar@gmail.com" className="btn">Contact for Opportunities</a>
                    <a
                        href="https://www.linkedin.com/in/swapnil-menkar-7051852b/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline"
                    >
                        View LinkedIn
                    </a>
                </div>
            </section>
        </div>
    );
};

export default About;
