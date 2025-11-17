from manim import *

class PracticeProblems(Scene):
    def construct(self):
        # Create number line
        number_line = NumberLine(
            x_range=[-1, 8, 1],
            length=10,
            color=WHITE,
            include_numbers=True,
            label_direction=DOWN,
            font_size=24
        )
        
        # Position number line
        number_line.move_to(ORIGIN)
        
        # Add title
        title = Text("Practice Problems", font_size=36, color=BLUE)
        title.to_edge(UP)
        
        # Display initial setup
        self.play(Write(title))
        self.play(Create(number_line))
        self.wait(1)
        
        # Problem 1: 4 + 1
        self.solve_problem("4 + 1", 4, 1, 5, number_line)
        
        # Problem 2: 0 + 5
        self.solve_problem("0 + 5", 0, 5, 5, number_line)
        
        # Problem 3: 3 + 3
        self.solve_problem("3 + 3", 3, 3, 6, number_line)
        
        self.wait(2)
    
    def solve_problem(self, problem_text, start_pos, jump_amount, result, number_line):
        # Clear previous problem elements
        self.remove(*[mob for mob in self.mobjects if isinstance(mob, (Text, MathTex)) and mob != self.mobjects[0]])
        
        # Show problem
        problem = Text(f"Problem: {problem_text}", font_size=28, color=YELLOW)
        problem.to_edge(UP, buff=1.5)
        
        self.play(Write(problem))
        self.wait(1)
        
        # Create point at starting position
        point = Dot(color=RED, radius=0.1)
        point.move_to(number_line.number_to_point(start_pos))
        
        # Show starting point
        self.play(Create(point))
        self.wait(0.5)
        
        # Create arrow showing the jump
        start_point = number_line.number_to_point(start_pos)
        end_point = number_line.number_to_point(start_pos + jump_amount)
        
        arrow = Arrow(
            start=start_point + UP * 0.5,
            end=end_point + UP * 0.5,
            color=GREEN,
            buff=0
        )
        
        # Add jump label
        jump_label = Text(f"+{jump_amount}", font_size=20, color=GREEN)
        jump_label.next_to(arrow, UP, buff=0.1)
        
        # Animate the jump
        self.play(Create(arrow), Write(jump_label))
        self.play(point.animate.move_to(end_point), run_time=1.5)
        self.wait(0.5)
        
        # Show result
        result_text = Text(f"{problem_text} = {result}", font_size=32, color=WHITE)
        result_text.to_edge(DOWN, buff=1)
        
        self.play(Write(result_text))
        self.wait(2)
        
        # Clean up for next problem
        self.play(
            FadeOut(problem),
            FadeOut(point),
            FadeOut(arrow),
            FadeOut(jump_label),
            FadeOut(result_text)
        )
        self.wait(0.5)