
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/useAuth";
import { FaGoogle } from "react-icons/fa";
import { Button } from "@/components/ui/button";

const GoogleButton = () => {
    const { setUser } = useAuth();
    const router = useRouter();

    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                const { data } = await axios.post("/api/auth/google", {
                    access_token: tokenResponse.access_token,
                });

                localStorage.setItem("token", data.token);
                toast.success("Добро пожаловать, " + data.user.userName);
                setUser(data.user);
                router.replace("/workspace");

            } catch (err: any) {
                console.error(err);
                toast.error("Ошибка входа через Google");
            }
        },
        onError: () => toast.error("Не удалось войти через Google"),
    });

    return (
        <Button
            onClick={() => googleLogin()}
            className="flex items-center gap-2 bg-white text-gray-700 border hover:bg-gray-100"
            type="button"
        >
            <FaGoogle className="text-red-500" />
            Войти через Google
        </Button>
    );
};

export default GoogleButton;
