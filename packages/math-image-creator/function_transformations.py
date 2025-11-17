from manim import *

class FunctionTransformations(Scene):
    def construct(self):
        # Create axes
        axes = Axes(
            x_range=[-3, 3, 1],
            y_range=[-2, 4, 1],
            x_length=8,
            y_length=6,
            axis_config={"color": BLUE},
            tips=False,
        )
        
        # Add labels
        axes_labels = axes.get_axis_labels(x_label="x", y_label="y")
        
        # Create the base function f(x) = x^2
        base_func = axes.plot(lambda x: x**2, color=WHITE)
        base_label = MathTex("f(x) = x^2", color=WHITE).to_edge(UP)
        
        # Display base function
        self.play(Create(axes), Write(axes_labels))
        self.play(Create(base_func), Write(base_label))
        self.wait(2)
        
        # Vertical shift: f(x) + 2
        shifted_func = axes.plot(lambda x: x**2 + 2, color=GREEN)
        shifted_label = MathTex("f(x) + 2", color=GREEN).next_to(base_label, DOWN)
        
        self.play(
            Transform(base_func.copy(), shifted_func),
            Write(shifted_label)
        )
        self.wait(2)
        
        # Horizontal shift: f(x - 1)
        h_shifted_func = axes.plot(lambda x: (x - 1)**2, color=YELLOW)
        h_shifted_label = MathTex("f(x - 1)", color=YELLOW).next_to(shifted_label, DOWN)
        
        self.play(
            FadeOut(shifted_func),
            FadeOut(shifted_label),
            Transform(base_func.copy(), h_shifted_func),
            Write(h_shifted_label)
        )
        self.wait(2)
        
        # Vertical stretch: 2f(x)
        stretched_func = axes.plot(lambda x: 2 * x**2, color=RED)
        stretched_label = MathTex("2 \\cdot f(x)", color=RED).next_to(base_label, DOWN)
        
        self.play(
            FadeOut(h_shifted_func),
            FadeOut(h_shifted_label),
            Transform(base_func.copy(), stretched_func),
            Write(stretched_label)
        )
        self.wait(2)
        
        # Combined transformation: 2f(x - 1) + 1
        combined_func = axes.plot(lambda x: 2 * (x - 1)**2 + 1, color=PURPLE)
        combined_label = MathTex("2f(x - 1) + 1", color=PURPLE).next_to(stretched_label, DOWN)
        
        self.play(
            FadeOut(stretched_func),
            FadeOut(stretched_label),
            Transform(base_func.copy(), combined_func),
            Write(combined_label)
        )
        self.wait(2)
        
        # Show all transformations together
        all_funcs = VGroup(
            base_func,
            axes.plot(lambda x: x**2 + 2, color=GREEN),
            axes.plot(lambda x: (x - 1)**2, color=YELLOW),
            axes.plot(lambda x: 2 * x**2, color=RED),
            combined_func
        )
        
        all_labels = VGroup(
            MathTex("f(x) = x^2", color=WHITE),
            MathTex("f(x) + 2", color=GREEN),
            MathTex("f(x - 1)", color=YELLOW),
            MathTex("2f(x)", color=RED),
            MathTex("2f(x - 1) + 1", color=PURPLE)
        ).arrange(DOWN, aligned_edge=LEFT).scale(0.7).to_edge(RIGHT)
        
        self.play(
            FadeOut(combined_func),
            FadeOut(combined_label),
            FadeOut(base_label)
        )
        
        for func, label in zip(all_funcs, all_labels):
            self.play(
                Create(func),
                Write(label),
                run_time=0.5
            )
        
        self.wait(3)