import "./config/module-alias"
import { ExpressAppAdapter } from "@/infra/express/adapters";

const app = ExpressAppAdapter.getIstance();

app.listen(3000);
