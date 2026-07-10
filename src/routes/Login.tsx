import {supabase} from "@/lib/supabase";
import {useNavigate} from "react-router";
import {LoginForm} from "@/components/login-form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

const formSchema = z.object({
    email: z
        .string()
        .min(1, "E-Mail ist ein Pflichtfeld.")
        .email("Bitte gib eine gültige E-Mail-Adresse ein."),
    password: z
        .string()
        .min(1, "Bitte geben Sie ein Passwort ein."),
});

type LoginFormValues = z.infer<typeof formSchema>;

export default function Login() {
    const navigate = useNavigate();

    const {
        register, handleSubmit, formState: {errors, isSubmitting},
    } = useForm<LoginFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onSubmit(data: LoginFormValues) {
        const {error} = await supabase.auth.signInWithPassword({
            email: data.email,
            password: data.password,
        });

        if (error) {
            alert(error.message);
        } else {
            navigate("/app/dashboard");
        }
    }

    return (
        <LoginForm title="Login" className="w-m-[450px] mx-auto mt-15">
            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
                <div>
                    <Input
                        type="email"
                        placeholder="Email"
                        {...register("email")}
                    />
                    {errors.email && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.email.message}
                        </p>
                    )}
                </div>

                <div>
                    <Input
                        type="password"
                        placeholder="Password"
                        {...register("password")}
                    />
                    {errors.password && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.password.message}
                        </p>
                    )}
                </div>

                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Wird eingeloggt..." : "Login"}
                </Button>
            </form>
        </LoginForm>
    );
}