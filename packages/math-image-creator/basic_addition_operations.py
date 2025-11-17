from manim import *

class BasicAdditionOperations(Scene):
    def construct(self):
        # First example: 2 + 3 = ?
        self.first_addition_example()
        self.wait(2)
        self.clear()
        
        # Second example: (-4) + 6 = ?
        self.second_addition_example()
        self.wait(2)
    
    def first_addition_example(self):
        # Display the equation "2 + 3 = ?" at the top
        equation = MathTex("2 + 3 = ?").scale(1.2).to_edge(UP)
        self.play(Write(equation))
        self.wait(1)
        
        # Create number line
        number_line = NumberLine(
            x_range=[-1, 8, 1],
            length=10,
            include_numbers=True,
            label_direction=DOWN
        ).shift(DOWN * 0.5)
        
        self.play(Create(number_line))
        self.wait(1)
        
        # Place a dot at "2"
        dot_at_2 = Dot(number_line.number_to_point(2), color=BLUE, radius=0.1)
        dot_label = Text("Start", font_size=20).next_to(dot_at_2, UP, buff=0.1)
        
        self.play(Create(dot_at_2), Write(dot_label))
        self.wait(1)
        
        # Animate arrow moving 3 units to the right
        arrow_start = number_line.number_to_point(2)
        arrow_end = number_line.number_to_point(5)
        
        # Create arrow
        arrow = Arrow(arrow_start, arrow_end, color=GREEN, buff=0)
        arrow_label = Text("+3", font_size=24, color=GREEN).next_to(arrow, UP, buff=0.1)
        
        self.play(GrowArrow(arrow), Write(arrow_label))
        self.wait(1)
        
        # Show dot landing on "5"
        dot_at_5 = Dot(number_line.number_to_point(5), color=RED, radius=0.1)
        end_label = Text("End", font_size=20).next_to(dot_at_5, UP, buff=0.1)
        
        self.play(Create(dot_at_5), Write(end_label))
        self.wait(1)
        
        # Show the result: "2 + 3 = 5"
        result = MathTex("2 + 3 = 5", color=YELLOW).scale(1.2).to_edge(UP)
        self.play(Transform(equation, result))
        self.wait(2)
    
    def second_addition_example(self):
        # Display the equation "(-4) + 6 = ?" at the top
        equation = MathTex("(-4) + 6 = ?").scale(1.2).to_edge(UP)
        self.play(Write(equation))
        self.wait(1)
        
        # Create number line
        number_line = NumberLine(
            x_range=[-6, 4, 1],
            length=10,
            include_numbers=True,
            label_direction=DOWN
        ).shift(DOWN * 0.5)
        
        self.play(Create(number_line))
        self.wait(1)
        
        # Place a dot at "-4"
        dot_at_neg4 = Dot(number_line.number_to_point(-4), color=BLUE, radius=0.1)
        dot_label = Text("Start", font_size=20).next_to(dot_at_neg4, UP, buff=0.1)
        
        self.play(Create(dot_at_neg4), Write(dot_label))
        self.wait(1)
        
        # Animate arrow moving 6 units to the right
        arrow_start = number_line.number_to_point(-4)
        arrow_end = number_line.number_to_point(2)
        
        # Create arrow
        arrow = Arrow(arrow_start, arrow_end, color=GREEN, buff=0)
        arrow_label = Text("+6", font_size=24, color=GREEN).next_to(arrow, UP, buff=0.1)
        
        self.play(GrowArrow(arrow), Write(arrow_label))
        self.wait(1)
        
        # Show dot landing on "2"
        dot_at_2 = Dot(number_line.number_to_point(2), color=RED, radius=0.1)
        end_label = Text("End", font_size=20).next_to(dot_at_2, UP, buff=0.1)
        
        self.play(Create(dot_at_2), Write(end_label))
        self.wait(1)
        
        # Show the result: "(-4) + 6 = 2"
        result = MathTex("(-4) + 6 = 2", color=YELLOW).scale(1.2).to_edge(UP)
        self.play(Transform(equation, result))
        self.wait(2)