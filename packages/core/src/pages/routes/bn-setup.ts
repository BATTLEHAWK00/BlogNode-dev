import { BlogNodeInternalHandler } from '../internalRoutes';

// todo: setup page
const handler: BlogNodeInternalHandler = {
  async get(req, res) {
    return res.internalRender('firstSetup.ejs');
  },
};

export default handler;
