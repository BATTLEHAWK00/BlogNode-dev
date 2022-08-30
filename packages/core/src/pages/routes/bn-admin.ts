import { BlogNodeInternalHandler } from '../internalRoutes';

// todo: admin page
const handler: BlogNodeInternalHandler = {
  async get(req, res) {
    return res.internalRender('firstSetup.ejs');
  },
};

export default handler;
