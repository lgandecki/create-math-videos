from manim import *

class EducationalMathConcept(Scene):
    """
    Educational Script: Understanding Mathematical Relationships
    
    // Mock edit applied based on request: Create a detailed educational script for a math video about: werewrw
    
    Script formatted as markdown with clear sections and timestamps:
    
    ## Introduction (0:00 - 0:30)
    Welcome to our exploration of mathematical relationships!
    Today we'll discover how numbers relate to each other through patterns and operations.
    
    ## Main Concepts Explanation (0:30 - 2:00)
    1. Number Patterns - How sequences of numbers follow rules
    2. Basic Operations - Addition, multiplication and their visual representations
    3. Geometric Growth - How values can increase exponentially
    
    ## Examples with Step-by-Step Solutions (2:00 - 4:00)
    Example 1: Doubling Pattern
    - Start with 1
    - Double it: 1 × 2 = 2
    - Double again: 2 × 2 = 4
    - Continue: 4 × 2 = 8, 8 × 2 = 16...
    
    Example 2: Square Numbers
    - 1² = 1 (1×1)
    - 2² = 4 (2×2)
    - 3² = 9 (3×3)
    - Visual representation as actual squares
    
    ## Summary/Conclusion (4:00 - 4:30)
    - Patterns help us understand mathematical relationships
    - Visual representations make abstract concepts concrete
    - Mathematics is all around us in nature and daily life
    
    // This is a fake implementation that adds this comment to show the edit was processed.
    """
    
    def construct(self):
        # Introduction Section (0:00 - 0:30)
        title = Text("Mathematical Relationships", font_size=48, color=BLUE)
        subtitle = Text("Discovering Patterns in Numbers", font_size=36, color=WHITE)
        subtitle.next_to(title, DOWN)
        
        self.play(Write(title))
        self.play(FadeIn(subtitle))
        self.wait(2)
        self.play(FadeOut(title), FadeOut(subtitle))
        
        # Main Concepts Section (0:30 - 2:00)
        concept_title = Text("Key Concepts", font_size=42, color=GREEN)
        concept_title.to_edge(UP)
        
        concepts = VGroup(
            Text("1. Number Patterns", font_size=32),
            Text("2. Basic Operations", font_size=32),
            Text("3. Geometric Growth", font_size=32)
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.5)
        concepts.next_to(concept_title, DOWN, buff=0.8)
        
        self.play(Write(concept_title))
        for concept in concepts:
            self.play(FadeIn(concept, shift=RIGHT))
            self.wait(0.5)
        self.wait(2)
        self.play(FadeOut(concept_title), FadeOut(concepts))
        
        # Example 1: Doubling Pattern (2:00 - 3:00)
        example1_title = Text("Example 1: Doubling Pattern", font_size=36, color=YELLOW)
        example1_title.to_edge(UP)
        self.play(Write(example1_title))
        
        # Create visual representation of doubling
        numbers = [1, 2, 4, 8, 16]
        number_objects = VGroup()
        
        for i, num in enumerate(numbers):
            num_text = Text(str(num), font_size=48)
            if i > 0:
                num_text.next_to(number_objects[-1], RIGHT, buff=1)
            number_objects.add(num_text)
        
        number_objects.center()
        
        # Animate the doubling process
        self.play(Write(number_objects[0]))
        for i in range(1, len(numbers)):
            arrow = Arrow(
                number_objects[i-1].get_right(),
                number_objects[i].get_left(),
                color=GREEN
            )
            multiply_text = Text("×2", font_size=24, color=GREEN)
            multiply_text.next_to(arrow, UP, buff=0.1)
            
            self.play(
                Create(arrow),
                Write(multiply_text),
                Write(number_objects[i])
            )
            self.wait(0.5)
        
        self.wait(2)
        self.play(FadeOut(number_objects), FadeOut(example1_title))
        
        # Example 2: Square Numbers (3:00 - 4:00)
        example2_title = Text("Example 2: Square Numbers", font_size=36, color=YELLOW)
        example2_title.to_edge(UP)
        self.play(Write(example2_title))
        
        # Create visual squares
        square_group = VGroup()
        for i in range(1, 4):
            # Create the square
            square = Square(side_length=i*0.5, color=BLUE, fill_opacity=0.5)
            
            # Create the label
            label = MathTex(f"{i}^2 = {i*i}", font_size=36)
            label.next_to(square, DOWN)
            
            # Create a group for square and label
            square_with_label = VGroup(square, label)
            
            if i > 1:
                square_with_label.next_to(square_group[-1], RIGHT, buff=1)
            
            square_group.add(square_with_label)
        
        square_group.center()
        square_group.shift(DOWN * 0.5)
        
        # Animate squares appearing
        for item in square_group:
            self.play(
                DrawBorderThenFill(item[0]),
                Write(item[1])
            )
            self.wait(0.5)
        
        self.wait(2)
        self.play(FadeOut(square_group), FadeOut(example2_title))
        
        # Summary Section (4:00 - 4:30)
        summary_title = Text("Summary", font_size=42, color=GREEN)
        summary_title.to_edge(UP)
        
        summary_points = VGroup(
            Text("• Patterns reveal mathematical relationships", font_size=28),
            Text("• Visualization makes concepts clearer", font_size=28),
            Text("• Mathematics surrounds us daily", font_size=28)
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.4)
        summary_points.center()
        
        self.play(Write(summary_title))
        for point in summary_points:
            self.play(FadeIn(point, shift=UP))
            self.wait(0.5)
        
        self.wait(2)
        
        # Final message
        thank_you = Text("Thank you for learning with us!", font_size=36, color=BLUE)
        thank_you.center()
        
        self.play(
            FadeOut(summary_title),
            FadeOut(summary_points),
            FadeIn(thank_you)
        )
        self.wait(2)
        self.play(FadeOut(thank_you))