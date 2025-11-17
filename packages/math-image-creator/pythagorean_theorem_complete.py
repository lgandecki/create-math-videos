from manim import *
import numpy as np

class PythagoreanTheoremComplete(Scene):
    def construct(self):
        # Introduction
        self.introduction()
        self.wait(2)
        self.clear()
        
        # Understanding the Relationship
        self.understanding_relationship()
        self.wait(2)
        self.clear()
        
        # Quick Application
        self.quick_application()
        self.wait(2)
        self.clear()
        
        # Conclusion
        self.conclusion()
        self.wait(3)

    def introduction(self):
        # Display title
        title = Text("The Pythagorean Theorem", font_size=48, color=BLUE)
        title.to_edge(UP)
        self.play(Write(title))
        self.wait(1)
        
        # Create a simple right-angled triangle
        triangle = Polygon(
            [-2, -1, 0],
            [2, -1, 0],
            [-2, 2, 0],
            color=WHITE,
            fill_opacity=0.3,
            fill_color=LIGHT_GRAY
        )
        
        self.play(Create(triangle))
        self.wait(1)
        
        # Purpose statement
        purpose = Text("A fundamental rule for right-angled triangles", 
                      font_size=24, color=YELLOW)
        purpose.next_to(triangle, DOWN, buff=1)
        self.play(Write(purpose))

    def understanding_relationship(self):
        # Create the right triangle
        triangle = Polygon(
            [-2, -1, 0],
            [2, -1, 0],
            [-2, 2, 0],
            color=WHITE,
            stroke_width=3
        )
        
        self.play(Create(triangle))
        self.wait(1)
        
        # Highlight the right angle
        right_angle_square = Square(side_length=0.3, color=RED, fill_opacity=0.5)
        right_angle_square.move_to([-2, -1, 0])
        right_angle_square.shift([0.15, 0.15, 0])
        self.play(Create(right_angle_square))
        self.wait(1)
        
        # Label the sides
        label_a = MathTex("a", color=BLUE, font_size=36)
        label_a.next_to([-2, 0.5, 0], LEFT)
        
        label_b = MathTex("b", color=GREEN, font_size=36)
        label_b.next_to([0, -1, 0], DOWN)
        
        label_c = MathTex("c", color=RED, font_size=36)
        label_c.next_to([0, 0.5, 0], RIGHT)
        
        self.play(Write(label_a), Write(label_b), Write(label_c))
        self.wait(1)
        
        # Create squares on each side
        # Square on side 'a' (vertical side)
        square_a = Square(side_length=3, color=BLUE, fill_opacity=0.5)
        square_a.next_to([-2, -1, 0], LEFT, buff=0)
        square_a.shift([0, 1.5, 0])
        
        # Square on side 'b' (horizontal side)
        square_b = Square(side_length=4, color=GREEN, fill_opacity=0.5)
        square_b.next_to([-2, -1, 0], DOWN, buff=0)
        square_b.shift([2, 0, 0])
        
        # Square on side 'c' (hypotenuse)
        # Calculate the length of hypotenuse
        hyp_length = np.sqrt(3**2 + 4**2)  # 5
        square_c = Square(side_length=hyp_length, color=RED, fill_opacity=0.3)
        # Position it appropriately along the hypotenuse
        square_c.rotate(np.arctan(3/4))
        square_c.move_to([1, 1.5, 0])
        
        # Animate squares forming
        self.play(Create(square_a))
        self.wait(0.5)
        self.play(Create(square_b))
        self.wait(0.5)
        
        # Show visual combination
        combo_text = Text("a² + b² =", font_size=24, color=WHITE)
        combo_text.to_edge(UP)
        self.play(Write(combo_text))
        
        # Create the square on hypotenuse
        self.play(Create(square_c))
        self.wait(1)
        
        # Display the formula
        formula = MathTex("a^2 + b^2 = c^2", font_size=48, color=YELLOW)
        formula.to_edge(DOWN)
        self.play(Write(formula))

    def quick_application(self):
        # Show a new triangle with specific values
        triangle = Polygon(
            [-1.5, -1, 0],
            [1.5, -1, 0],
            [-1.5, 2, 0],
            color=WHITE,
            stroke_width=3
        )
        
        self.play(Create(triangle))
        self.wait(1)
        
        # Label with numerical values
        label_3 = MathTex("a = 3", color=BLUE, font_size=32)
        label_3.next_to([-1.5, 0.5, 0], LEFT)
        
        label_4 = MathTex("b = 4", color=GREEN, font_size=32)
        label_4.next_to([0, -1, 0], DOWN)
        
        label_c = MathTex("c = ?", color=RED, font_size=32)
        label_c.next_to([0, 0.5, 0], RIGHT)
        
        self.play(Write(label_3), Write(label_4), Write(label_c))
        self.wait(1)
        
        # Prompt
        prompt = Text("Let's find the missing side 'c'", font_size=28, color=YELLOW)
        prompt.to_edge(UP)
        self.play(Write(prompt))
        self.wait(1)
        
        # Show calculation steps
        step1 = MathTex("3^2 + 4^2 = c^2", font_size=36)
        step1.to_edge(DOWN, buff=2)
        self.play(Write(step1))
        self.wait(1)
        
        step2 = MathTex("9 + 16 = c^2", font_size=36)
        step2.next_to(step1, DOWN)
        self.play(Write(step2))
        self.wait(1)
        
        step3 = MathTex("25 = c^2", font_size=36)
        step3.next_to(step2, DOWN)
        self.play(Write(step3))
        self.wait(1)
        
        step4 = MathTex("c = \\sqrt{25}", font_size=36)
        step4.next_to(step3, DOWN)
        self.play(Write(step4))
        self.wait(1)
        
        step5 = MathTex("c = 5", font_size=36, color=RED)
        step5.next_to(step4, DOWN)
        self.play(Write(step5))
        self.wait(1)
        
        # Replace the label
        new_label_c = MathTex("c = 5", color=RED, font_size=32)
        new_label_c.next_to([0, 0.5, 0], RIGHT)
        self.play(Transform(label_c, new_label_c))

    def conclusion(self):
        # Display triangle again
        triangle = Polygon(
            [-2, -1, 0],
            [2, -1, 0],
            [-2, 2, 0],
            color=WHITE,
            stroke_width=3,
            fill_opacity=0.2,
            fill_color=LIGHT_GRAY
        )
        
        self.play(Create(triangle))
        self.wait(1)
        
        # Reinforce the formula
        formula = MathTex("a^2 + b^2 = c^2", font_size=60, color=YELLOW)
        formula.next_to(triangle, DOWN, buff=1)
        self.play(Write(formula))
        self.wait(1)
        
        # Summary
        summary = Text(
            "The sum of the squares of the two shorter sides\nequals the square of the longest side",
            font_size=24,
            color=WHITE
        )
        summary.to_edge(DOWN)
        self.play(Write(summary))
        self.wait(2)