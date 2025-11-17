from manim import *

class BuildingDifferentLines(Scene):
    def construct(self):
        # Set up coordinate system
        axes = Axes(
            x_range=[-5, 5, 1],
            y_range=[-2, 8, 1],
            x_length=10,
            y_length=6,
            axis_config={"color": BLUE},
            x_axis_config={
                "numbers_to_include": np.arange(-4, 5, 2),
                "numbers_with_elongated_ticks": np.arange(-4, 5, 2),
            },
            y_axis_config={
                "numbers_to_include": np.arange(-2, 9, 2),
                "numbers_with_elongated_ticks": np.arange(-2, 9, 2),
            },
            tips=False,
        )
        axes_labels = axes.get_axis_labels()
        
        # Display the main equation
        equation_title = MathTex("y = mx + b", font_size=48).to_edge(UP)
        equation_title.set_color(YELLOW)
        
        self.play(Write(axes), Write(axes_labels))
        self.play(Write(equation_title))
        self.wait(1)
        
        # Example 1: Start with y = x, change m to 2, then b to 1
        self.example_1(axes, equation_title)
        
        # Clear for next example
        self.play(FadeOut(Group(*self.mobjects).remove(axes, axes_labels, equation_title)))
        self.wait(0.5)
        
        # Example 2: Start with y = x, change m to -0.5, then b to 3
        self.example_2(axes, equation_title)
        
        # Final emphasis
        self.show_final_message(axes, equation_title)
        
    def example_1(self, axes, equation_title):
        # Example 1 title
        example_1_title = Text("Przykład 1:", font_size=36, color=GREEN).next_to(equation_title, DOWN, buff=0.5)
        self.play(Write(example_1_title))
        
        # Start with y = x
        current_eq = MathTex("y = x", font_size=40).next_to(example_1_title, DOWN, buff=0.3)
        current_eq.set_color(WHITE)
        
        # Create the initial line y = x
        line_1 = axes.plot(lambda x: x, color=RED, x_range=[-4, 4])
        
        self.play(Write(current_eq))
        self.play(Create(line_1))
        self.wait(1)
        
        # Change m to 2: y = 2x
        new_eq_1 = MathTex("y = 2x", font_size=40).move_to(current_eq.get_center())
        new_eq_1.set_color(WHITE)
        line_2 = axes.plot(lambda x: 2*x, color=RED, x_range=[-2, 2])
        
        self.play(Transform(current_eq, new_eq_1))
        self.play(Transform(line_1, line_2))
        self.wait(1)
        
        # Change b to 1: y = 2x + 1
        final_eq_1 = MathTex("y = 2x + 1", font_size=40).move_to(current_eq.get_center())
        final_eq_1.set_color(WHITE)
        line_3 = axes.plot(lambda x: 2*x + 1, color=RED, x_range=[-2, 2])
        
        self.play(Transform(current_eq, final_eq_1))
        self.play(Transform(line_1, line_3))
        self.wait(2)
        
    def example_2(self, axes, equation_title):
        # Example 2 title
        example_2_title = Text("Przykład 2:", font_size=36, color=GREEN).next_to(equation_title, DOWN, buff=0.5)
        self.play(Write(example_2_title))
        
        # Start with y = x again
        current_eq = MathTex("y = x", font_size=40).next_to(example_2_title, DOWN, buff=0.3)
        current_eq.set_color(WHITE)
        
        # Create the initial line y = x
        line_1 = axes.plot(lambda x: x, color=BLUE, x_range=[-4, 4])
        
        self.play(Write(current_eq))
        self.play(Create(line_1))
        self.wait(1)
        
        # Change m to -0.5: y = -0.5x
        new_eq_1 = MathTex("y = -0.5x", font_size=40).move_to(current_eq.get_center())
        new_eq_1.set_color(WHITE)
        line_2 = axes.plot(lambda x: -0.5*x, color=BLUE, x_range=[-4, 4])
        
        self.play(Transform(current_eq, new_eq_1))
        self.play(Transform(line_1, line_2))
        self.wait(1)
        
        # Change b to 3: y = -0.5x + 3
        final_eq_1 = MathTex("y = -0.5x + 3", font_size=40).move_to(current_eq.get_center())
        final_eq_1.set_color(WHITE)
        line_3 = axes.plot(lambda x: -0.5*x + 3, color=BLUE, x_range=[-4, 4])
        
        self.play(Transform(current_eq, final_eq_1))
        self.play(Transform(line_1, line_3))
        self.wait(2)
        
    def show_final_message(self, axes, equation_title):
        # Final emphasis message
        final_message = Text(
            "Zmieniając 'm' i 'b', możemy narysować\nkażdą prostą linię!",
            font_size=32,
            color=YELLOW,
            t2c={"'m'": RED, "'b'": GREEN}
        ).next_to(axes, DOWN, buff=0.5)
        
        self.play(Write(final_message))
        self.wait(3)