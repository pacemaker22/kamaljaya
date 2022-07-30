import React, { useEffect, useState } from "react";
import Router from "next/router";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import useRequest from "../hooks/use-request";
import Loader from "../components/common/Loader";

const signup = ({ currentUser }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [nama, setNama] = useState("");
	const [loading, setLoading] = useState(false);
	const [showErrors, setShowErrors] = useState(false);
	const [isReady, setIsReady] = useState(false);

	const { doRequest, errors } = useRequest({
		url: "/api/users/signup",
		method: "post",
		body: {
			email,
			password,
			nama,
		},
		onSuccess: () => {
			Router.push("/");
			setLoading(false);
		},
	});

	useEffect(() => {
		// Protect unauthorized access
		if (currentUser) {
			return Router.push("/");
		} else {
			setIsReady(true);
		}

		if (errors) {
			setLoading(false);
			setShowErrors(true);
		}
	}, [errors]);

	const submitHandler = async (event) => {
		event.preventDefault();
		setLoading(true);

		doRequest();
	};

	const myLoader = ({ src }) => {
		return `./asset/${src}`;
	};

	return (
		isReady && (
			<>
				<Head>
					<title>Sign Up | Aurapan</title>
				</Head>
				{loading ? (
					<div
						className="d-flex justify-content-center align-items-center px-0"
						style={{ marginTop: "80px" }}
					>
						<Loader />
					</div>
				) : (
					<Container className="app-container register-box">
						<Row>
							<Link href={`/signin`} passHref>
								<Col className="banner-img">
									<Image
										loader={myLoader}
										src="sign_in_banner_1.png"
										layout="fill"
										objectFit="cover"
										objectPosition="left center"
										priority="true"
										alt="sign up banner"
									/>
								</Col>
							</Link>

							<Col>
								<h1>Sign Up</h1>
								<Form className="mt-3" onSubmit={submitHandler}>
									<Form.Group controlId="email" className="my-3">
										<Form.Label>Alamat Email</Form.Label>
										<Form.Control
											type="email"
											placeholder="Masukan email"
											value={email}
											onChange={(e) => setEmail(e.target.value)}
										></Form.Control>
									</Form.Group>

									<Form.Group controlId="password" className="my-3">
										<Form.Label>Password</Form.Label>
										<Form.Control
											type="password"
											placeholder="Masukan password"
											value={password}
											onChange={(e) => setPassword(e.target.value)}
										></Form.Control>
									</Form.Group>

									<Form.Group controlId="nama" className="my-3">
										<Form.Label>Nama</Form.Label>
										<Form.Control
											type="text"
											placeholder="Masukan nama"
											value={nama}
											onChange={(e) => setNama(e.target.value)}
										></Form.Control>
									</Form.Group>
									{showErrors ? errors : null}
									<Button className="mt-3" type="submit" variant="dark">
										Daftar
									</Button>
								</Form>
							</Col>
						</Row>
					</Container>
				)}
			</>
		)
	);
};

export default signup;
