import React from 'react';
import { createPage } from '@util/page';
import { Button, Form } from 'react-bootstrap';

const LoginPage = createPage(() => (
  <>
    <Form.Group>
      <Form.Label>用户名：</Form.Label>
      <Form.Control placeholder="Username" />
    </Form.Group>
    <Form.Group>
      <Form.Label>密码：</Form.Label>
      <Form.Control placeholder="Password" />
    </Form.Group>
  </>
));

export default LoginPage;
