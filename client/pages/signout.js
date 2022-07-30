import React, { useEffect } from "react";
import Router from "next/router";
import Head from "next/head";

import useRequest from "../hooks/use-request";
import Loader from "../components/common/Loader";

const signout = () => {
	const { doRequest } = useRequest({
		url: "/api/users/signout",
		method: "post",
		body: {},
		onSuccess: () => Router.push("/"),
	});

	useEffect(() => {
		doRequest();
	}, []);

	return (
		<>
			<Head>
				<title>Keluar</title>
			</Head>
			<div
				className="d-flex justify-content-center align-items-center px-0"
				style={{ marginTop: "80px" }}
			>
				<Loader />
			</div>
		</>
	);
};

export default signout;
