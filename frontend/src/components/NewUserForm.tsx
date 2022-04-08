import { gql, useMutation } from "@apollo/client";
import { FormEvent, useState } from "react";
import { GET_USER } from "../App";

export const CREATE_USER = gql`
  mutation ($name: String!) {
    createUser(name: $name) {
      id
      name
    }
  }
`;

export function NewUserForm() {
  const [name, setName] = useState("");
  const [createUser, { data, loading, error }] = useMutation(CREATE_USER);

  async function handleCreateUser(event: FormEvent) {
    event.preventDefault();

    if (!name) {
      return;
    }

    await createUser({
      variables: {
        name,
      },
      //   refetchQueries: [GET_USER],
      update: (cache, { data: { createUser } }) => {
        const { users } = cache.readQuery({ query: GET_USER })!;
        cache.writeQuery({
          query: GET_USER,
          data: {
            users: [...users, createUser],
          },
        });
      },
    });
  }

  return (
    <form onSubmit={handleCreateUser}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        name="inputName"
        id="name"
      />
      <button type="submit">Enviar</button>
    </form>
  );
}
