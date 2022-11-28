import "./config/module-alias"
import { ExpressAppAdapter } from "@/infra/express/adapters";

const app = ExpressAppAdapter.getInstance();

app.listen(3000);
