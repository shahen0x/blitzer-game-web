"use client";

import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
export default function AmplifyAuthProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<Authenticator signUpAttributes={["preferred_username"]}>
			{children}
		</Authenticator>
	)
}