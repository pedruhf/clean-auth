import "./config/module-alias"
import { ExpressAppAdapter } from "@/main/config";

const app = ExpressAppAdapter.getIstance();

app.listen(3000);
