from manim import *

class MathematicalTestPrinciple(Scene):
    def construct(self):
        # Title
        title = Text("The Important Mathematical Test Principle", font_size=48, color=BLUE)
        title.to_edge(UP)
        
        self.play(Write(title))
        self.wait(2)
        
        # Introduction concept
        intro_text = Text(
            "In mathematics, we often need to determine if a number,\n"
            "shape, or concept possesses a specific property.\n"
            "This is done by applying a \"test\"—a set of rules or conditions.",
            font_size=32,
            color=WHITE
        )
        intro_text.next_to(title, DOWN, buff=1)
        
        self.play(Write(intro_text))
        self.wait(3)
        
        # Examples section
        examples_title = Text("Simple Examples:", font_size=36, color=GREEN)
        examples_title.next_to(intro_text, DOWN, buff=1)
        
        self.play(Write(examples_title))
        self.wait(1)
        
        # Example 1: Prime number
        example1 = Text("Is a number prime?", font_size=28, color=YELLOW)
        example1.next_to(examples_title, DOWN, buff=0.5)
        example1.shift(LEFT * 2)
        
        # Example 2: Equilateral triangle
        example2 = Text("Is this triangle equilateral?", font_size=28, color=YELLOW)
        example2.next_to(example1, DOWN, buff=0.5)
        
        self.play(Write(example1))
        self.wait(1)
        self.play(Write(example2))
        self.wait(2)
        
        # Visual demonstration with a triangle
        triangle = Polygon(
            [-1, -1, 0], [1, -1, 0], [0, 1, 0],
            color=RED,
            fill_opacity=0.3
        )
        triangle.next_to(example2, RIGHT, buff=1)
        
        self.play(Create(triangle))
        self.wait(1)
        
        # Test result
        result_text = Text("Test: All sides equal? ✓", font_size=24, color=GREEN)
        result_text.next_to(triangle, DOWN, buff=0.5)
        
        self.play(Write(result_text))
        self.wait(3)
        
        # Fade out everything
        self.play(FadeOut(VGroup(title, intro_text, examples_title, example1, example2, triangle, result_text)))
        self.wait(1)